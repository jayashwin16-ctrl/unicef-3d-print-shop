export type ReqWithBody = {
  body?: unknown;
  on?: (event: "data" | "end" | "error", cb: (chunk?: Buffer | string) => void) => void;
};

/** Parse JSON body on Vercel (req.body may be unset when not using Next.js bodyParser). */
export async function readJsonBody<T>(req: ReqWithBody): Promise<T> {
  const body = req.body;
  if (body !== undefined && body !== null) {
    if (typeof body === "string") {
      if (!body.trim()) return {} as T;
      return JSON.parse(body) as T;
    }
    if (typeof body === "object") return body as T;
  }
  if (typeof req.on !== "function") return {} as T;

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on!("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    });
    req.on!("end", () => resolve());
    req.on!("error", reject);
  });
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {} as T;
  return JSON.parse(raw) as T;
}
