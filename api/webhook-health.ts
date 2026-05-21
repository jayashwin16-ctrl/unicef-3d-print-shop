import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * GET /api/webhook-health — quick check that email/webhook env vars exist on Vercel.
 * Stripe must POST to https://www.3dprintsforgood.com/api/stripe-webhook (www, not apex).
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const has = (name: string) => Boolean(process.env[name]?.trim());

  res.status(200).json({
    ok: true,
    stripeWebhookEndpoint: "https://www.3dprintsforgood.com/api/stripe-webhook",
    stripeNote:
      "Use the www URL in Stripe. Apex (3dprintsforgood.com) returns 307; Stripe does not follow redirects.",
    env: {
      STRIPE_SECRET_KEY: has("STRIPE_SECRET_KEY"),
      STRIPE_WEBHOOK_SECRET: has("STRIPE_WEBHOOK_SECRET"),
      RESEND_API_KEY: has("RESEND_API_KEY"),
      RESEND_FROM_EMAIL: has("RESEND_FROM_EMAIL"),
      ORDER_NOTIFY_EMAIL: has("ORDER_NOTIFY_EMAIL"),
    },
    stripeEventRequired: "checkout.session.completed",
  });
}
