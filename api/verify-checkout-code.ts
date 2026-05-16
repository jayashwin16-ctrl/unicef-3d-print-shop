import {
  CH_OK,
  CH_PENDING,
  formatClearCookieHeader,
  formatSetCookieHeader,
  safeCodeEqual,
  signOk,
  verifyPendingCookie,
  type OkPayload,
} from "./checkout-cookies";
import { getCookieValue, jsonResponse, methodNotAllowed } from "./http";
import { createPostHandler } from "./vercel-bridge";

export const runtime = "nodejs";

type Body = { code?: string };

export async function POST(request: Request): Promise<Response> {
  try {
    let body: Body;
    try {
      body = (await request.json()) as Body;
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const code = (body.code || "").trim();
    if (!/^\d{6}$/.test(code)) {
      return jsonResponse({ error: "Enter the 6-digit code from your email" }, 400);
    }

    const pending = verifyPendingCookie(getCookieValue(request, CH_PENDING));
    if (!pending) {
      return jsonResponse({ error: "Code expired or step missing. Request a new code." }, 400);
    }
    if (!safeCodeEqual(pending.c, code)) {
      return jsonResponse({ error: "Incorrect code" }, 400);
    }

    const exp = Date.now() + 60 * 60 * 1000;
    const ok: OkPayload = { e: pending.e, f: pending.f, exp, v: 1 };
    let token: string;
    try {
      token = signOk(ok);
    } catch (err) {
      console.error("verify-checkout-code config error:", err);
      return jsonResponse({ error: "Server is not configured (CHECKOUT_SESSION_SECRET)" }, 500);
    }

    return jsonResponse({ ok: true, flowType: pending.f }, 200, [
      formatClearCookieHeader(CH_PENDING),
      formatSetCookieHeader(CH_OK, token, 60 * 60),
    ]);
  } catch (err) {
    console.error("verify-checkout-code unhandled:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    return jsonResponse({ error: msg }, 500);
  }
}

export function GET(): Response {
  return methodNotAllowed();
}

export default createPostHandler(POST);
