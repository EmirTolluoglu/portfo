import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHash, createHmac, timingSafeEqual } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ---- Oturum (şifre .env'den: NAZ_PASSWORD) ---- */
const COOKIE_NAME = "naz_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 gün

const secret = () => {
  const s = process.env.NAZ_PASSWORD;
  if (!s) throw new Error("NAZ_PASSWORD .env içinde tanımlı değil");
  return s;
};
const sign = (exp: number) => createHmac("sha256", secret()).update(`naz:${exp}`).digest("hex");

const makeToken = () => {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${exp}.${sign(exp)}`;
};

const verifyToken = (token?: string) => {
  try {
    if (!token) return false;
    const [expStr, mac] = token.split(".");
    const exp = Number(expStr);
    if (!exp || !mac || exp < Date.now() / 1000) return false;
    const a = Buffer.from(mac);
    const b = Buffer.from(sign(exp));
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
};

const passwordOk = (input: string) => {
  const h = (v: string) => createHash("sha256").update(v).digest();
  return timingSafeEqual(h(input), h(secret()));
};

/* ---- Log yardımcıları ---- */
const HIDDEN = new Set(["cookie", "authorization"]);

const fails = new Map<string, { n: number; t: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function clientIp(h: Headers) {
  const via = ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"].find((k) => h.get(k));
  const raw = via ? h.get(via)! : "";
  return { ip: raw.split(",")[0].trim() || "bilinmiyor", via: via ?? "yok" };
}

function visibleHeaders(h: Headers) {
  const out: Record<string, string> = {};
  h.forEach((v, k) => {
    if (!HIDDEN.has(k)) out[k] = v;
  });
  return out;
}

/* ---- GET: cookie geçerli mi? ---- */
export async function GET() {
  const ok = verifyToken((await cookies()).get(COOKIE_NAME)?.value);
  return NextResponse.json({ ok });
}

/* ---- POST: şifre ile giriş ---- */
export async function POST(req: Request) {
  const { ip, via } = clientIp(req.headers);

  const rec = fails.get(ip);
  if (rec && Date.now() - rec.t < WINDOW_MS && rec.n >= LIMIT) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let password = "";
  try {
    const body = await req.json();
    if (typeof body?.password === "string") password = body.password.slice(0, 200);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!password || !passwordOk(password)) {
    const fresh = rec && Date.now() - rec.t < WINDOW_MS ? rec : { n: 0, t: Date.now() };
    fails.set(ip, { n: fresh.n + 1, t: fresh.t });
    console.log("[naz-login] BAŞARISIZ DENEME", { at: new Date().toISOString(), ip, ipKaynağı: via, userAgent: req.headers.get("user-agent") });
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  fails.delete(ip);
  console.log(
    "[naz-login] GİRİŞ YAPILDI",
    JSON.stringify({ at: new Date().toISOString(), ip, ipKaynağı: via, headers: visibleHeaders(req.headers) }, null, 2)
  );

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}