import Stripe from "stripe";
import { jsonResponse, methodNotAllowed } from "./http";
import { createPostHandler } from "./vercel-bridge";

export const runtime = "nodejs";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

/** 6-digit PIN for buyer verification (email + Stripe metadata). */
function generateVerificationPin(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(100000 + (buf[0] % 900000));
}

function getPaymentIntentId(session: Stripe.Checkout.Session): string | null {
  const pi = session.payment_intent;
  if (typeof pi === "string") return pi;
  if (pi && typeof pi === "object" && "id" in pi) return (pi as Stripe.PaymentIntent).id;
  return null;
}

async function attachPinToPaymentIntent(paymentIntentId: string, pin: string): Promise<void> {
  const stripe = getStripe();
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  await stripe.paymentIntents.update(paymentIntentId, {
    metadata: {
      ...pi.metadata,
      verification_pin: pin,
    },
  });
}

async function sendResendEmail(to: string[], subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }
  const from = process.env.RESEND_FROM_EMAIL || "Prints for UNICEF <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend failed: ${res.status} ${errText}`);
  }
}

async function sendPurchasePinEmail(to: string, pin: string, sessionId: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[stripe-webhook] RESEND_API_KEY not set; skipping buyer PIN email");
    return;
  }
  await sendResendEmail(
    [to],
    "Your order verification PIN",
    [
      "Thanks for your purchase!",
      "",
      `Your verification PIN is: ${pin}`,
      "",
      "Keep this email. The shop may ask for this PIN to confirm you are the buyer (for example for pickup).",
      "",
      `Order reference: ${sessionId}`,
    ].join("\n")
  );
}

function orderMetaLines(m: Record<string, string> | null | undefined): string {
  if (!m) return "";
  const skip = new Set(["verification_pin"]);
  const lines: string[] = ["Checkout form (from your site):"];
  for (const [k, v] of Object.entries(m)) {
    if (skip.has(k) || !v) continue;
    lines.push(`  ${k}: ${v}`);
  }
  return lines.join("\n");
}

async function sendShopOwnerNewOrderEmail(params: {
  ownerEmail: string;
  buyerEmail: string;
  amount: string;
  sessionId: string;
  pin: string;
  orderMeta?: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[stripe-webhook] RESEND_API_KEY not set; skipping shop owner new-order email");
    return;
  }
  const { ownerEmail, buyerEmail, amount, sessionId, pin, orderMeta } = params;
  await sendResendEmail(
    [ownerEmail],
    `New order — ${amount}`,
    [
      "Someone completed a purchase on your shop.",
      "",
      `Stripe payer email: ${buyerEmail}`,
      `Amount paid: ${amount}`,
      `Checkout session: ${sessionId}`,
      `Verification PIN (emailed to buyer): ${pin}`,
      "",
      orderMeta || "No form metadata on session.",
      "",
      "Open Stripe Dashboard → Payments for line items and shipping details.",
    ].join("\n")
  );
}

function formatAmount(amountTotal: number | null, currency: string | null): string {
  if (amountTotal == null || !currency) return "Unknown";
  return `${(amountTotal / 100).toFixed(2)} ${currency.toUpperCase()}`;
}

async function sendDiscordNotification(message: string): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });
}

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return jsonResponse({ error: "Missing webhook signature or secret" }, 400);
  }

  try {
    const rawBody = Buffer.from(await request.arrayBuffer());
    const event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const amount = formatAmount(session.amount_total, session.currency);
      const buyerEmail = session.customer_details?.email || session.customer_email || undefined;
      const pin = generateVerificationPin();
      const piId = getPaymentIntentId(session);

      if (piId) {
        await attachPinToPaymentIntent(piId, pin);
      } else {
        console.warn("[stripe-webhook] No payment_intent on session; PIN not stored in Stripe metadata");
      }

      if (buyerEmail && buyerEmail.includes("@")) {
        try {
          await sendPurchasePinEmail(buyerEmail, pin, session.id);
        } catch (e) {
          console.error("[stripe-webhook] Failed to send PIN email:", e);
        }
      } else {
        console.warn("[stripe-webhook] No buyer email on session; PIN email not sent");
      }

      const ownerNotify = process.env.ORDER_NOTIFY_EMAIL?.trim();
      if (ownerNotify && ownerNotify.includes("@")) {
        try {
          const orderMeta = orderMetaLines(
            session.metadata as Record<string, string> | undefined
          );
          await sendShopOwnerNewOrderEmail({
            ownerEmail: ownerNotify,
            buyerEmail: buyerEmail && buyerEmail.includes("@") ? buyerEmail : "(not provided)",
            amount,
            sessionId: session.id,
            pin,
            orderMeta,
          });
        } catch (e) {
          console.error("[stripe-webhook] Failed to send shop owner email:", e);
        }
      } else {
        console.log("[stripe-webhook] ORDER_NOTIFY_EMAIL not set; skipping shop owner email");
      }

      const message = `New order paid. Buyer: ${buyerEmail || "unknown"}. Amount: ${amount}. Session: ${session.id}. Verification PIN (also emailed): ${pin}`;
      console.log("[stripe-webhook]", message);
      await sendDiscordNotification(message);
    }

    return jsonResponse({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return jsonResponse({ error: "Webhook error" }, 400);
  }
}

export function GET(): Response {
  return methodNotAllowed();
}

export default createPostHandler(POST);
