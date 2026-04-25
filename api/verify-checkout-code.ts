import {
  CH_OK,
  CH_PENDING,
  formatClearCookieHeader,
  formatSetCookieHeader,
  parseCookieHeader,
  signOk,
  verifyPendingCookie,
  type OkPayload,
} from "./lib/checkout-cookies";

declare const process: { env: Record<string, string | undefined> };

export const config = { api: { bodyParser: true } };

type Body = { code?: string };

type Req = { method?: string; body?: Body; headers?: { cookie?: string } };
type Res = { status: (n: number) => { json: (o: object) => void }; setHeader: (k: string, v: string | string[] | number) => void };

import { timingSafeEqual } from "node:crypto";

function safeCodeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const code = (req.body?.code || "").trim();
  if (!/^\d{6}$/.test(code)) {
    res.status(400).json({ error: "Enter the 6-digit code from your email" });
    return;
  }

  const cookies = parseCookieHeader(req.headers?.cookie);
  let raw: string | undefined;
  try {
    raw = cookies[CH_PENDING] ? decodeURIComponent(cookies[CH_PENDING]) : undefined;
  } catch {
    raw = cookies[CH_PENDING];
  }
  const pending = verifyPendingCookie(raw);
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
  const token = signOk(ok);
  res.setHeader("Set-Cookie", [formatClearCookieHeader(CH_PENDING), formatSetCookieHeader(CH_OK, token, 60 * 60)]);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ ok: true, flowType: pending.f });
}
