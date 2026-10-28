import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export const runtime = "nodejs";

// Oturum kontrolü (naz-login ile aynı imza mantığı)
const COOKIE_NAME = "naz_session";
const verifyToken = (token?: string) => {
  try {
    const secret = process.env.NAZ_PASSWORD;
    if (!secret || !token) return false;
    const [expStr, mac] = token.split(".");
    const exp = Number(expStr);
    if (!exp || !mac || exp < Date.now() / 1000) return false;
    const want = createHmac("sha256", secret).update(`naz:${exp}`).digest("hex");
    const a = Buffer.from(mac);
    const b = Buffer.from(want);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
};

const MAX_BODY = 8_000; // bayt, kötü niyetli büyük istekleri kes
const ALLOWED = new Set([
  "kusme-seviyesi",
  "durusma",
  "denemeler",
  "affetti",
  "kuponlar",
  "final",
]);

// Uzun metinleri kırp, sadece düz veri bırak
const clean = (v: unknown, depth = 0): unknown => {
  if (typeof v === "string") return v.slice(0, 500);
  if (typeof v === "number" || typeof v === "boolean" || v === null) return v;
  if (depth > 3) return undefined;
  if (Array.isArray(v)) return v.slice(0, 30).map((x) => clean(x, depth + 1));
  if (typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>)
        .slice(0, 30)
        .map(([k, x]) => [k.slice(0, 50), clean(x, depth + 1)])
    );
  }
  return undefined;
};

export async function POST(req: Request) {
  // Sadece giriş yapmış oturum log yazabilir
  if (!verifyToken((await cookies()).get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = typeof body.event === "string" ? body.event : "";
  if (!ALLOWED.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  console.log(`[naz-oyunu] ${event}`, JSON.stringify(clean(body), null, 2));
  return NextResponse.json({ ok: true });
}