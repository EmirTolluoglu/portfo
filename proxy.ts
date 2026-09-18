import { NextRequest, NextResponse } from "next/server";
import { YKS_COOKIE, makeToken } from "@/lib/yksAuth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login sayfası serbest
  if (pathname === "/yks-playground/login") {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const cookie = req.cookies.get(YKS_COOKIE)?.value;
  const valid = !!cookie && cookie === (await makeToken());

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/yks-playground/login";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/yks-playground/:path*", "/api/calculate"],
};