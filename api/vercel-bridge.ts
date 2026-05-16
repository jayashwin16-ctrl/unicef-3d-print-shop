/** Bridge Web Standard handlers (POST/GET) to Vercel Node req/res for broad runtime support. */

type VercelReq = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  url?: string;
};

type VercelRes = {
  status: (code: number) => { json: (body: object) => void };
  setHeader: (name: string, value: string | string[] | number) => void;
};

function headersFromReq(req: VercelReq): Headers {
  const headers = new Headers();
  if (!req.headers) return headers;
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    headers.set(key, Array.isArray(value) ? value[0] : value);
  }
  return headers;
}

function bodyFromReq(req: VercelReq): BodyInit | undefined {
  const { body } = req;
  if (body === undefined || body === null) return undefined;
  if (typeof body === "string") return body;
  if (Buffer.isBuffer(body)) return body;
  if (body instanceof ArrayBuffer) return body;
  if (body instanceof Uint8Array) return body;
  return JSON.stringify(body);
}

function buildRequest(req: VercelReq, method: string): Request {
  return new Request(`http://localhost${req.url || "/api"}`, {
    method,
    headers: headersFromReq(req),
    body: bodyFromReq(req),
  });
}

async function writeResponse(res: VercelRes, response: Response): Promise<void> {
  const bodyText = await response.text();

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    res.setHeader(key, value);
  });

  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];
  if (setCookies.length > 0) {
    res.setHeader("Set-Cookie", setCookies);
  } else {
    const single = response.headers.get("set-cookie");
    if (single) res.setHeader("Set-Cookie", single);
  }

  if (bodyText) {
    try {
      res.status(response.status).json(JSON.parse(bodyText) as object);
      return;
    } catch {
      /* non-JSON body */
    }
  }

  res.status(response.status).json(bodyText ? { message: bodyText } : {});
}

export function createPostHandler(handler: (request: Request) => Promise<Response>) {
  return async function vercelHandler(req: VercelReq, res: VercelRes): Promise<void> {
    try {
      if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }
      const response = await handler(buildRequest(req, "POST"));
      await writeResponse(res, response);
    } catch (err) {
      console.error("API handler error:", err);
      const msg = err instanceof Error ? err.message : "Server error";
      res.status(500).json({ error: msg });
    }
  };
}

export function createGetHandler(handler: (request: Request) => Promise<Response>) {
  return async function vercelHandler(req: VercelReq, res: VercelRes): Promise<void> {
    try {
      if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }
      const response = await handler(buildRequest(req, "GET"));
      await writeResponse(res, response);
    } catch (err) {
      console.error("API handler error:", err);
      const msg = err instanceof Error ? err.message : "Server error";
      res.status(500).json({ error: msg });
    }
  };
}
