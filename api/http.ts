/** JSON Response helpers for Vercel Web Standard functions. */
export function jsonResponse(data: object, status = 200, setCookies?: string[]): Response {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (setCookies) {
    for (const c of setCookies) headers.append("Set-Cookie", c);
  }
  return new Response(JSON.stringify(data), { status, headers });
}

export function methodNotAllowed(): Response {
  return jsonResponse({ error: "Method not allowed" }, 405);
}

export function getCookieValue(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
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
