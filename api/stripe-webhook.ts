import Stripe from "stripe";

declare const process: { env: Record<string, string | undefined> };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: { bodyParser: false },
};

type ReqLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  on: (event: "data" | "end" | "error", cb: (chunk?: unknown) => void) => void;
};

type ResLike = {
  status: (n: number) => { json: (o: object) => void };
};

function getHeaderValue(v: string | string[] | undefined): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

async function readRawBody(req: ReqLike): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return await new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
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

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const signature = getHeaderValue(req.headers["stripe-signature"]);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    res.status(400).json({ error: "Missing webhook signature or secret" });
    return;
  }

  try {
    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const amount = formatAmount(session.amount_total, session.currency);
      const buyer = session.customer_details?.email || "unknown email";
      const message = `New order paid. Buyer: ${buyer}. Amount: ${amount}. Session: ${session.id}`;
      console.log("[stripe-webhook]", message);
      await sendDiscordNotification(message);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    res.status(400).json({ error: "Webhook error" });
  }
}
