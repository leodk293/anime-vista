import { NextResponse } from "next/server";

const MAL_HOST = "api.myanimelist.net";

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get("url");

    if (!target) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    const parsed = new URL(target);
    if (parsed.hostname !== MAL_HOST || !parsed.pathname.startsWith("/v2/")) {
      return NextResponse.json({ error: "Invalid MAL url" }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { error: "Missing MAL client id" },
        { status: 500 },
      );
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        "X-MAL-CLIENT-ID": clientId,
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("MAL proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch MyAnimeList data" },
      { status: 500 },
    );
  }
};
