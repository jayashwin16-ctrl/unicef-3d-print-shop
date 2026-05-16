import { jsonResponse } from "./http";

export const runtime = "nodejs";

export function GET(): Response {
  return jsonResponse({ ok: true, service: "api" });
}
