import { NextResponse } from "next/server";

const MAL = "https://api.myanimelist.net/v2";

export async function GET(request, { params }) {
  const { path } = await params;
  const { search } = new URL(request.url);

  const res = await fetch(`${MAL}/${path.join("/")}${search}`, {
    headers: { "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID },
    cache: "no-store",
  });

  const body = await res.text();

  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
