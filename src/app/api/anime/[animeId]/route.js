import { NextResponse } from "next/server";

const MAL_BASE = "https://api.myanimelist.net/v2/anime";

async function malFetch(url) {
  const res = await fetch(url, {
    headers: { "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = new Error(`MAL responded with ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

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

  const { searchParams } = new URL(request.url);
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10) || 0);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10) || 10),
  );

  const [detailsResult, charactersResult] = await Promise.allSettled([
    malFetch(`${MAL_BASE}/${animeId}?fields=related_anime,recommendations`),
    malFetch(
      `${MAL_BASE}/${animeId}/characters?offset=${offset}&limit=${limit}&fields=id,first_name,last_name,alternative_name,main_picture,num_favorites`,
    ),
  ]);

  // Both calls failed: surface a real error status instead of a fake 200
  if (detailsResult.status === "rejected" && charactersResult.status === "rejected") {
    const status = detailsResult.reason?.status ?? 502;
    return NextResponse.json(
      { error: "Failed to fetch data from MAL" },
      { status },
    );
  }

  const details = detailsResult.status === "fulfilled" ? detailsResult.value : null;
  const characters =
    charactersResult.status === "fulfilled" ? charactersResult.value : null;

  return NextResponse.json({
    related_anime: details?.related_anime ?? [],
    recommendations: details?.recommendations ?? [],
    characters: characters?.data ?? [],
    hasMoreCharacters: Boolean(characters?.paging?.next),
    errors: {
      details: detailsResult.status === "rejected",
      characters: charactersResult.status === "rejected",
    },
  });
}