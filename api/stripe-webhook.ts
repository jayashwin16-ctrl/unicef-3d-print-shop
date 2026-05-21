import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export const config = {
  api: { bodyParser: false },
};

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/** Stripe signature verification needs the exact raw bytes Vercel received. */
async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const body = req.body;
  if (typeof body === "string") return Buffer.from(body, "utf8");
  if (Buffer.isBuffer(body)) return body;
  return readRawBody(req);
}

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
    metadata: { ...pi.metadata, verification_pin: pin },
  });
}

async function sendResendEmail(to: string[], subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");
  const from = process.env.RESEND_FROM_EMAIL || "Prints for Good <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend failed: ${res.status} ${errText}`);
  }
}

function siteOriginFromSession(session: Stripe.Checkout.Session): string {
  const url = session.success_url;
  if (!url) return process.env.SITE_URL?.replace(/\/$/, "") || "https://3dprintsforgood.com";
  try {
    return new URL(url).origin;
  } catch {
    return process.env.SITE_URL?.replace(/\/$/, "") || "https://3dprintsforgood.com";
  }
}

function studentFromMeta(meta: Record<string, string> | undefined): { name?: string; grade?: string } {
  if (!meta) return {};
  if (meta.bobcat_name) {
    return { name: meta.bobcat_name, grade: meta.bobcat_grade };
  }
  if (meta.regular_name) {
    return { name: meta.regular_name };
  }
  return {};
}

async function sendThankYouEmail(params: {
  to: string;
  amount: string;
  sessionId: string;
  pin: string;
  meta?: Record<string, string>;
  session: Stripe.Checkout.Session;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[stripe-webhook] RESEND_API_KEY not set; skipping thank-you email");
    return;
  }

  const { to, amount, sessionId, pin, meta, session } = params;
  const origin = siteOriginFromSession(session);
  const student = studentFromMeta(meta);

  const lines = [
    "Thank you for your order from 3D Prints for Good!",
    "",
    "Your payment was successful. We appreciate your support — part of each sale goes toward",
    "children-focused giving aligned with UNICEF's mission.",
    "",
    `Amount paid: ${amount}`,
    `Order reference: ${sessionId}`,
  ];

  if (student.name) {
    lines.push(`Student: ${student.name}`);
    if (student.grade) {
      lines.push(`Grade: ${student.grade}`);
    }
  }

  lines.push(
    "",
    `Your order verification PIN: ${pin}`,
    "Please save this PIN. We may ask for it at school pickup to confirm your order.",
    ""
  );

  lines.push(
    "Questions? Reply to this email or visit our shop:",
    `${origin}/shop`,
    "",
    "Thank you again for supporting 3D Prints for Good!",
    "— 3D Prints for Good"
  );

  await sendResendEmail([to], "Thank you for your order — 3D Prints for Good", lines.join("\n"));
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || typeof signature !== "string" || !webhookSecret) {
    res.status(400).json({ error: "Missing webhook signature or secret" });
    return;
  }

  try {
    const rawBody = await getRawBody(req);
    if (rawBody.length === 0) {
      console.error("[stripe-webhook] Empty request body — check bodyParser: false and endpoint URL (use www, no redirect)");
      res.status(400).json({ error: "Empty body" });
      return;
    }

    const event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const amount = formatAmount(session.amount_total, session.currency);
      const buyerEmail = session.customer_details?.email || session.customer_email || undefined;
      const pin = generateVerificationPin();
      const piId = getPaymentIntentId(session);

      if (piId) {
        try {
          await attachPinToPaymentIntent(piId, pin);
        } catch (e) {
          console.error("[stripe-webhook] Failed to attach PIN to payment intent (emails will still send):", e);
        }
      } else {
        console.warn("[stripe-webhook] No payment_intent on session; PIN not stored in Stripe metadata");
      }

      const orderMeta = session.metadata as Record<string, string> | undefined;

      if (buyerEmail && buyerEmail.includes("@")) {
        try {
          await sendThankYouEmail({
            to: buyerEmail,
            amount,
            sessionId: session.id,
            pin,
            meta: orderMeta,
            session,
          });
        } catch (e) {
          console.error("[stripe-webhook] Failed to send thank-you email:", e);
        }
      } else {
        console.warn("[stripe-webhook] No buyer email on session; thank-you email not sent");
      }

      const ownerNotify = process.env.ORDER_NOTIFY_EMAIL?.trim();
      if (ownerNotify && ownerNotify.includes("@")) {
        try {
          await sendShopOwnerNewOrderEmail({
            ownerEmail: ownerNotify,
            buyerEmail: buyerEmail && buyerEmail.includes("@") ? buyerEmail : "(not provided)",
            amount,
            sessionId: session.id,
            pin,
            orderMeta: orderMetaLines(orderMeta),
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

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    res.status(400).json({ error: "Webhook error" });
  }
}
