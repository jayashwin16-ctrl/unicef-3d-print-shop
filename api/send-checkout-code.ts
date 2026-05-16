import {
  CH_PENDING,
  generateSixDigitCode,
  setCookie,
  signPending,
  type PendingPayload,
} from "./checkout-cookies";
import { readJsonBody, type ReqWithBody } from "./read-json-body";

declare const process: { env: Record<string, string | undefined> };

type Body = { email?: string; flowType?: "bobcat" | "regular" };

type Req = ReqWithBody & { method?: string; headers?: { cookie?: string } };
type Res = { status: (n: number) => { json: (o: object) => void }; setHeader: (k: string, v: string | string[] | number) => void };

async function sendResendEmail(to: string, subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  const from = process.env.RESEND_FROM_EMAIL || "Prints for UNICEF <onboarding@resend.dev>";
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

export default async function handler(req: Req, res: Res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const { email, flowType } = await readJsonBody<Body>(req);
    const e = (email || "").trim().toLowerCase();
    if (!e || !e.includes("@")) {
      res.status(400).json({ error: "Valid email is required" });
      return;
    }
    if (flowType !== "bobcat" && flowType !== "regular") {
      res.status(400).json({ error: "flowType must be bobcat or regular" });
      return;
    }

    const code = generateSixDigitCode();
    const exp = Date.now() + 15 * 60 * 1000;
    const payload: PendingPayload = { c: code, e, f: flowType, exp, v: 1 };
    let token: string;
    try {
      token = signPending(payload);
    } catch (err) {
      console.error("send-checkout-code config error:", err);
      res.status(500).json({ error: "Server is not configured for checkout codes (CHECKOUT_SESSION_SECRET)" });
      return;
    }
    setCookie(res, CH_PENDING, token, 15 * 60);

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
        error: detail.startsWith("Resend:") ? detail : "Could not send email. Check RESEND_API_KEY and domain setup.",
      });
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("send-checkout-code unhandled:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    res.status(500).json({ error: msg });
  }
}
