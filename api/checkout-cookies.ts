import { createHmac, randomInt, timingSafeEqual } from "crypto";

export const CH_PENDING = "ch_p";
export const CH_OK = "ch_ok";

export type PendingPayload = { c: string; e: string; f: "bobcat" | "regular"; exp: number; v: 1 };
export type OkPayload = { e: string; f: "bobcat" | "regular"; exp: number; v: 1 };

function getSecret(): string {
  const s = process.env.CHECKOUT_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("Set CHECKOUT_SESSION_SECRET (at least 16 characters) in environment variables");
  }
  return s;
}

function signData(data: object): string {
  const b = Buffer.from(JSON.stringify(data), "utf8");
  const sig = createHmac("sha256", getSecret()).update(b).digest("base64url");
  return `${b.toString("base64url")}.${sig}`;
}

function verifyData<T>(token: string | undefined): T | null {
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
    const o = JSON.parse(b.toString("utf8")) as T & { exp: number };
    if (o.exp < Date.now()) return null;
    return o;
  } catch {
    return null;
  }
}

export function signPending(p: PendingPayload): string {
  return signData(p);
}

export function verifyPendingCookie(raw: string | undefined): PendingPayload | null {
  return verifyData<PendingPayload>(raw);
}

export function signOk(p: OkPayload): string {
  return signData(p);
}

export function verifyOkCookie(raw: string | undefined): OkPayload | null {
  return verifyData<OkPayload>(raw);
}

export function generateSixDigitCode(): string {
  return String(randomInt(100000, 1000000));
}

export function safeCodeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  if (x.length !== y.length) return false;
  try {
    return timingSafeEqual(x, y);
  } catch {
    return false;
  }
}

export function parseCookieHeader(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const m: Record<string, string> = {};
  for (const part of header.split(";")) {
    const [k, ...r] = part.split("=");
    if (!k?.trim()) continue;
    m[k.trim()] = r.join("=").trim();
  }
  return m;
}

function cookieBaseOpts(): { secure: string; same: string } {
  const isProd = process.env.VERCEL || process.env.NODE_ENV === "production";
  return { secure: isProd ? "Secure; " : "", same: "SameSite=Lax" };
}

export function formatSetCookieHeader(name: string, value: string, maxAge: number): string {
  const { secure, same } = cookieBaseOpts();
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; ${secure}${same}`;
}

export function formatClearCookieHeader(name: string): string {
  return `${name}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`;
}

export function setCookie(
  res: { setHeader: (k: string, v: string | string[] | number) => void },
  name: string,
  value: string,
  maxAge: number
): void {
  res.setHeader("Set-Cookie", formatSetCookieHeader(name, value, maxAge));
}

export function clearCookie(
  res: { setHeader: (k: string, v: string | string[] | number) => void },
  name: string
): void {
  res.setHeader("Set-Cookie", formatClearCookieHeader(name));
}
