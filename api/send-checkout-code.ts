import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac, randomInt } from "crypto";

const CH_PENDING = "ch_p";

type Body = { email?: string; flowType?: "bobcat" | "regular" };
type PendingPayload = { c: string; e: string; f: "bobcat" | "regular"; exp: number; v: 1 };

function getSecret(): string {
  const s = process.env.CHECKOUT_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("Set CHECKOUT_SESSION_SECRET (at least 16 characters) in environment variables");
  }
  return s;
}

function signPending(p: PendingPayload): string {
  const b = Buffer.from(JSON.stringify(p), "utf8");
  const sig = createHmac("sha256", getSecret()).update(b).digest("base64url");
  return `${b.toString("base64url")}.${sig}`;
}

function formatSetCookie(name: string, value: string, maxAge: number): string {
  const secure = process.env.VERCEL || process.env.NODE_ENV === "production" ? "Secure; " : "";
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; ${secure}SameSite=Lax`;
}

function generateSixDigitCode(): string {
  return String(randomInt(100000, 1000000));
}

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

  res.setHeader("Set-Cookie", formatSetCookie(CH_PENDING, token, 15 * 60));
  res.status(200).json({ ok: true });
}
