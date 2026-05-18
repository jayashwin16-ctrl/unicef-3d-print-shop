import { createHmac, timingSafeEqual } from "crypto";

const CH_PENDING = "ch_p";
const CH_OK = "ch_ok";

type Body = { code?: string };
type PendingPayload = { c: string; e: string; f: "bobcat" | "regular"; exp: number; v: 1 };
type OkPayload = { e: string; f: "bobcat" | "regular"; exp: number; v: 1 };

type Req = {
  method?: string;
  body?: Body;
  headers?: { cookie?: string };
};

type Res = {
  status: (code: number) => { json: (o: object) => void };
  setHeader: (k: string, v: string | string[] | number) => void;
};

function getSecret(): string {
  const s = process.env.CHECKOUT_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("Set CHECKOUT_SESSION_SECRET (at least 16 characters) in environment variables");
  }
  return s;
}

function verifyData<T extends { exp: number }>(token: string | undefined): T | null {
  if (!token) return null;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;
  let b: Buffer;
  try {
    b = Buffer.from(payloadB64, "base64url");
  } catch {
    return null;
  }
  let expected: string;
  try {
    expected = createHmac("sha256", getSecret()).update(b).digest("base64url");
  } catch {
    return null;
  }
  if (expected.length !== sig.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(sig, "utf8"))) {
      return null;
    }
  } catch {
    return null;
  }
  try {
    const o = JSON.parse(b.toString("utf8")) as T;
    if (o.exp < Date.now()) return null;
    return o;
  } catch {
    return null;
  }
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

function formatSetCookieHeader(name: string, value: string, maxAge: number): string {
  const secure = process.env.VERCEL || process.env.NODE_ENV === "production" ? "Secure; " : "";
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; ${secure}SameSite=Lax`;
}

function formatClearCookieHeader(name: string): string {
  return `${name}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`;
}

function getCookie(req: Req, name: string): string | undefined {
  const header = req.headers?.cookie;
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.split("=");
    if (k?.trim() === name) {
      const raw = rest.join("=").trim();
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }
  return undefined;
}

export default async function handler(req: Req, res: Res): Promise<void> {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const code = (req.body?.code || "").trim();
    if (!/^\d{6}$/.test(code)) {
      res.status(400).json({ error: "Enter the 6-digit code from your email" });
      return;
    }

    const pending = verifyData<PendingPayload>(getCookie(req, CH_PENDING));
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
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ ok: true, flowType: pending.f });
  } catch (err) {
    console.error("verify-checkout-code unhandled:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    res.status(500).json({ error: msg });
  }
}
