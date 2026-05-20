import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  CH_OK,
  CH_PENDING,
  formatClearCookieHeader,
  formatSetCookieHeader,
  getCookieValue,
  safeCodeEqual,
  signOk,
  verifyPendingCookie,
  type OkPayload,
} from "../lib/checkout-cookies";

type Body = { code?: string };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = (req.body || {}) as Body;
  const code = (body.code || "").trim();
  if (!/^\d{6}$/.test(code)) {
    res.status(400).json({ error: "Enter the 6-digit code from your email" });
    return;
  }

  const cookieHeader = typeof req.headers.cookie === "string" ? req.headers.cookie : undefined;
  const pending = verifyPendingCookie(getCookieValue(cookieHeader, CH_PENDING));
  if (!pending) {
    res.status(400).json({ error: "Code expired or step missing. Request a new code." });
    return;
  }
  if (!safeCodeEqual(pending.c, code)) {
    res.status(400).json({ error: "Incorrect code" });
    return;
  }

  const exp = Date.now() + 60 * 60 * 1000;
  const ok: OkPayload = { e: pending.e, f: pending.f, exp, v: 1 };

  let token: string;
  try {
    token = signOk(ok);
  } catch (err) {
    console.error("verify-checkout-code config error:", err);
    res.status(500).json({ error: "Server is not configured (CHECKOUT_SESSION_SECRET)" });
    return;
  }

  res.setHeader("Set-Cookie", [
    formatClearCookieHeader(CH_PENDING),
    formatSetCookieHeader(CH_OK, token, 60 * 60),
  ]);
  res.status(200).json({ ok: true, flowType: pending.f });
}
