import { NextResponse } from "next/server";

const MAL_SEARCH_URL = "https://api.myanimelist.net/v2/anime";
const RESULT_LIMIT = 15;
const MAX_QUERY_LENGTH = 100;

export async function GET(request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: `Search query must be ${MAX_QUERY_LENGTH} characters or fewer` },
      { status: 400 },
    );
  }

  const clientId = process.env.MAL_CLIENT_ID;
  if (!clientId) {
    console.error("MAL_CLIENT_ID is not configured");
    return NextResponse.json(
      { error: "Anime search is not configured" },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    q: query,
    limit: String(RESULT_LIMIT),
    fields: "id,title,main_picture,start_season,genres",
  });

  try {
    const response = await fetch(`${MAL_SEARCH_URL}?${params}`, {
      headers: { "X-MAL-CLIENT-ID": clientId },
      signal: request.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`MAL anime search failed with status ${response.status}`);
      return NextResponse.json(
        { error: "Failed to fetch anime search results" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ data: data.data ?? [] });
  } catch (error) {
    if (error.name === "AbortError") throw error;

    console.error("Anime search route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime search results" },
      { status: 502 },
    );
  }
}
