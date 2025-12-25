"use client";

import { useState, useEffect, use } from "react";
import Loader from "../../../../../components/loader/Loader";
import AnimeBox from "../../../../../components/AnimeBox";

export default function RecommendationsPage({ params }) {
  const resolvedParams = use(params);
  const animeId = resolvedParams.animeId;

  const [animeRecommendations, setAnimeRecommendations] = useState({
    data: [],
    loading: true,
    error: false,
  });

  const [genresMap, setGenresMap] = useState({}); 

  async function fetchAnimeRecommendations() {
    setAnimeRecommendations((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/recommendations`
      );

      if (!response.ok) throw new Error("Fetch failed");

      const result = await response.json();

      setAnimeRecommendations({
        error: false,
        loading: false,
        data: result.data,
      });
    } catch (e) {
      setAnimeRecommendations((prev) => ({ ...prev, error: true }));
    }
  }

  async function loadGenres(id) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
    const data = await res.json();

    setGenresMap((prev) => ({
      ...prev,
      [id]: data.data?.genres ?? [],
    }));
  }

  useEffect(() => {
    fetchAnimeRecommendations();
  }, [animeId]);

  useEffect(() => {
    if (animeRecommendations.data.length > 0) {
      animeRecommendations.data.forEach((anime) => {
        loadGenres(anime.entry.mal_id);
      });
    }
  }, [animeRecommendations.data]);

  if (animeRecommendations.loading) return <Loader />;

  if (animeRecommendations.error) return <p>Something went wrong...</p>;

  if (animeRecommendations.data.length === 0)
    return (
      <p className=" text-white text-xl font-semibold">
        No recommendations found...
      </p>
    );

  return (
    <div className="text-white flex flex-col gap-10">
      <div className=" flex flex-col gap-2">
        <h1 className="text-xl font-bold">Recommendations</h1>
        <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {animeRecommendations.data.map((anime) => (
          <AnimeBox
            key={anime.entry.mal_id}
            animeId={anime.entry.mal_id}
            animeName={anime.entry.title}
            animeImage={anime.entry.images?.jpg?.large_image_url}
            year={anime.entry.year ?? 0}
            season={anime.entry.season ?? "Unknown"}
            genres={
              Array.isArray(genresMap[anime.entry.mal_id]) &&
              genresMap[anime.entry.mal_id].length > 0
                ? genresMap[anime.entry.mal_id].map((g) =>
                    typeof g === "object" && g !== null ? g.name : g
                  )
                : []
            }
          />
        ))}
      </div>
    </div>
  );
}
