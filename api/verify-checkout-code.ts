import {
  CH_OK,
  CH_PENDING,
  formatClearCookieHeader,
  formatSetCookieHeader,
  parseCookieHeader,
  safeCodeEqual,
  signOk,
  verifyPendingCookie,
  type OkPayload,
} from "./checkout-cookies";
import { readJsonBody, type ReqWithBody } from "./read-json-body";

declare const process: { env: Record<string, string | undefined> };

type Body = { code?: string };

type Req = ReqWithBody & { method?: string; headers?: { cookie?: string } };
type Res = { status: (n: number) => { json: (o: object) => void }; setHeader: (k: string, v: string | string[] | number) => void };

export default async function handler(req: Req, res: Res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const { code: rawCode } = await readJsonBody<Body>(req);
    const code = (rawCode || "").trim();
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
    let token: string;
    try {
      token = signOk(ok);
    } catch (err) {
      console.error("verify-checkout-code config error:", err);
      res.status(500).json({ error: "Server is not configured (CHECKOUT_SESSION_SECRET)" });
      return;
    }
    res.setHeader("Set-Cookie", [formatClearCookieHeader(CH_PENDING), formatSetCookieHeader(CH_OK, token, 60 * 60)]);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ ok: true, flowType: pending.f });
  } catch (err) {
    console.error("verify-checkout-code unhandled:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    res.status(500).json({ error: msg });
  }
}
