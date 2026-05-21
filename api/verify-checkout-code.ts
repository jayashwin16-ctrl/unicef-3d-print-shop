import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac, timingSafeEqual } from "crypto";

const CH_OK = "ch_ok";

type Body = { code?: string; flowType?: "bobcat" | "regular" };
type OkPayload = { e: string; f: "bobcat" | "regular"; exp: number; v: 1 };

function getSecret(): string {
  const s = process.env.CHECKOUT_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("Set CHECKOUT_SESSION_SECRET (at least 16 characters) in environment variables");
  }
  return s;
}

function getAccessCode(): string {
  const c = (process.env.CHECKOUT_ACCESS_CODE || "").trim();
  if (!/^\d{5}$/.test(c)) {
    throw new Error("Set CHECKOUT_ACCESS_CODE to a 5-digit code in environment variables");
  }
  return c;
}

function signOk(p: OkPayload): string {
  const b = Buffer.from(JSON.stringify(p), "utf8");
  const sig = createHmac("sha256", getSecret()).update(b).digest("base64url");
  return `${b.toString("base64url")}.${sig}`;
}

function safeCodeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  if (x.length !== y.length) return false;
  try {
    return timingSafeEqual(x, y);
  } catch {
    return false;
  }
}

function formatSetCookie(name: string, value: string, maxAge: number): string {
  const secure = process.env.VERCEL || process.env.NODE_ENV === "production" ? "Secure; " : "";
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; ${secure}SameSite=Lax`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = (req.body || {}) as Body;
  const code = (body.code || "").trim();
  const flowType = body.flowType;

  if (!/^\d{5}$/.test(code)) {
    res.status(400).json({ error: "Enter the 5-digit checkout code" });
    return;
  }
  if (flowType !== "bobcat" && flowType !== "regular") {
    res.status(400).json({ error: "flowType must be bobcat or regular" });
    return;
  }

  let expected: string;
  try {
    expected = getAccessCode();
  } catch (err) {
    console.error("verify-checkout-code config error:", err);
    res.status(500).json({ error: "Server is not configured (CHECKOUT_ACCESS_CODE)" });
    return;
  }

  if (!safeCodeEqual(expected, code)) {
    res.status(400).json({ error: "Incorrect code" });
    return;
  }

  const exp = Date.now() + 60 * 60 * 1000;
  const ok: OkPayload = { e: "", f: flowType, exp, v: 1 };

  let token: string;
  try {
    token = signOk(ok);
  } catch (err) {
    console.error("verify-checkout-code config error:", err);
    res.status(500).json({ error: "Server is not configured (CHECKOUT_SESSION_SECRET)" });
    return;
  }

  res.setHeader("Set-Cookie", formatSetCookie(CH_OK, token, 60 * 60));
  res.status(200).json({ ok: true, flowType });
}
