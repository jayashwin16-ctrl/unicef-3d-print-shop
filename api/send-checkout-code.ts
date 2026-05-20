import {
  CH_PENDING,
  formatSetCookieHeader,
  generateSixDigitCode,
  signPending,
  type PendingPayload,
} from "./checkout-cookies";
import { jsonResponse } from "./http";
import { createPostHandler } from "./vercel-bridge";

export const runtime = "nodejs";

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

export async function POST(request: Request): Promise<Response> {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const e = (body.email || "").trim().toLowerCase();
  const flowType = body.flowType;

  if (!e || !e.includes("@")) {
    return jsonResponse({ error: "Valid email is required" }, 400);
  }
  if (flowType !== "bobcat" && flowType !== "regular") {
    return jsonResponse({ error: "flowType must be bobcat or regular" }, 400);
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
    return jsonResponse(
      { error: "Server is not configured for checkout codes (CHECKOUT_SESSION_SECRET)" },
      500
    );
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
    return jsonResponse(
      {
        error: detail.startsWith("Resend:")
          ? detail
          : "Could not send email. Check RESEND_API_KEY and domain setup.",
      },
      500
    );
  }

  return jsonResponse({ ok: true }, 200, [formatSetCookieHeader(CH_PENDING, token, 15 * 60)]);
}

export default createPostHandler(POST);
