import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();

  try {
    const upstream = await fetch(`${process.env.YKS_PROXY_URL}/api/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Proxy-Secret": process.env.YKS_PROXY_SECRET || "",
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });

    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "Backend'e ulaşılamadı" }, { status: 502 });
  }
}