import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  CH_PENDING,
  formatSetCookieHeader,
  generateSixDigitCode,
  signPending,
  type PendingPayload,
} from "../lib/checkout-cookies";

type Body = { email?: string; flowType?: "bobcat" | "regular" };

async function sendResendEmail(to: string, subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const from = process.env.RESEND_FROM_EMAIL || "3D Prints for Good <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Resend: ${res.status} ${t}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = (req.body || {}) as Body;
  const e = (body.email || "").trim().toLowerCase();
  const flowType = body.flowType;

  if (!e || !e.includes("@")) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (flowType !== "bobcat" && flowType !== "regular") {
    res.status(400).json({ error: "flowType must be bobcat or regular" });
    return;
  }

  const code = generateSixDigitCode();
  const payload: PendingPayload = {
    c: code,
    e,
    f: flowType,
    exp: Date.now() + 15 * 60 * 1000,
    v: 1,
  };

  let token: string;
  try {
    token = signPending(payload);
  } catch (err) {
    console.error("send-checkout-code config error:", err);
    res.status(500).json({
      error: "Server is not configured for checkout codes (CHECKOUT_SESSION_SECRET)",
    });
    return;
  }

  const label = flowType === "bobcat" ? "Bobcat (school) checkout" : "Regular pickup";
  const text = [
    `Your ${label} verification code is: ${code}`,
    "",
    "It expires in 15 minutes. Enter it on the shop website to continue.",
  ].join("\n");

  try {
    await sendResendEmail(e, `Your checkout code — ${code}`, text);
  } catch (err) {
    console.error("send-checkout-code Resend error:", err);
    const detail = err instanceof Error ? err.message : "unknown";
    res.status(500).json({
      error: detail.startsWith("Resend:")
        ? detail
        : "Could not send email. Check RESEND_API_KEY and domain setup.",
    });
    return;
  }

  res.setHeader("Set-Cookie", formatSetCookieHeader(CH_PENDING, token, 15 * 60));
  res.status(200).json({ ok: true });
}
