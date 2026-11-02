import { NextResponse } from "next/server";

const MAL_BASE = "https://api.myanimelist.net/v2/anime";
const LIMIT = 100;
const MAX_PAGES = 10; // safety cap: 1000 characters max

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

  const characters = [];
  let offset = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await fetch(
      `${MAL_BASE}/${animeId}/characters?offset=${offset}&limit=${LIMIT}&fields=id,first_name,last_name,alternative_name,main_picture,num_favorites`,
      {
        headers: { "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      // Return what we have if a later page fails; fail only if nothing loaded
      if (characters.length > 0) break;
      return NextResponse.json(
        { error: `MAL responded with ${res.status}` },
        { status: res.status },
      );
    }

    const json = await res.json();
    characters.push(...(json.data ?? []));

    if (!json.paging?.next) break;
    offset += LIMIT;
  }

  return NextResponse.json({ characters });
}