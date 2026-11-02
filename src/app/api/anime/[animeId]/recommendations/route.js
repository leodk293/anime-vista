import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { animeId } = await params;

  if (!/^\d+$/.test(animeId)) {
    return NextResponse.json({ error: "Invalid anime id" }, { status: 400 });
  }

  if (!process.env.MAL_CLIENT_ID) {
    return NextResponse.json(
      { error: "MAL_CLIENT_ID is not configured" },
      { status: 500 },
    );
  }

  const res = await fetch(
    `https://api.myanimelist.net/v2/anime/${animeId}?fields=recommendations`,
    {
      headers: { "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `MAL responded with ${res.status}` },
      { status: res.status },
    );
  }

  const json = await res.json();
  return NextResponse.json({ recommendations: json.recommendations ?? [] });
}