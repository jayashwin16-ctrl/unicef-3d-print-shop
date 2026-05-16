import { jsonResponse } from "./http";
import { createGetHandler } from "./vercel-bridge";

export const runtime = "nodejs";

export function GET(): Response {
  return jsonResponse({ ok: true, service: "api" });
}

export default createGetHandler(GET);
