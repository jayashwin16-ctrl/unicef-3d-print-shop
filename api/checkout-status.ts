import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac, timingSafeEqual } from "crypto";

const CH_OK = "ch_ok";

type OkPayload = { e: string; f: "bobcat" | "regular"; exp: number; v: 1 };

function getCheckoutSecret(): string {
  const s = process.env.CHECKOUT_SESSION_SECRET;
  if (!s || s.length < 16) return "";
  return s;
}

function verifyOkCookie(raw: string | undefined): OkPayload | null {
  const secret = getCheckoutSecret();
  if (!secret || !raw) return null;
  const [payloadB64, sig] = raw.split(".");
  if (!payloadB64 || !sig) return null;
  let b: Buffer;
  try {
    b = Buffer.from(payloadB64, "base64url");
  } catch {
    return null;
  }
  let expected: string;
  try {
    expected = createHmac("sha256", secret).update(b).digest("base64url");
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
    const o = JSON.parse(b.toString("utf8")) as OkPayload;
    if (o.exp < Date.now()) return null;
    return o;
  } catch {
    return null;
  }
}

function getCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const cookieHeader = typeof req.headers.cookie === "string" ? req.headers.cookie : undefined;
  const ok = verifyOkCookie(getCookie(cookieHeader, CH_OK));

  if (!ok) {
    res.status(200).json({ verified: false });
    return;
  }

  res.status(200).json({
    verified: true,
    flowType: ok.f,
    email: ok.e,
  });
}
