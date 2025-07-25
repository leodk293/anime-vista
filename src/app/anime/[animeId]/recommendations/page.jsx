"use client";
import React from "react";
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

  async function fetchAnimeRecommendations() {
    setAnimeRecommendations((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/recommendations`
      );
      if (!response.ok) {
        throw new Error(`An error has occurred : ${response.status}`);
      }
      const result = await response.json();
      setAnimeRecommendations({
        error: false,
        loading: false,
        data: result.data,
      });
    } catch (error) {
      setAnimeRecommendations((prev) => ({ ...prev, error: true }));
      console.error(error.message);
    }
  }

  useEffect(() => {
    fetchAnimeRecommendations();
  }, []);

  if (animeRecommendations.loading) {
    return <Loader />;
  }

  if (animeRecommendations.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl text-red-500">
          Something went wrong, try again
        </h1>
      </div>
    );
  }

  if (animeRecommendations.data && animeRecommendations.data.length > 0) {
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
              animeImage={anime.entry.images.jpg.large_image_url}
              animeName={anime.entry.title}
            />
          ))}
        </div>
      </div>
    );
  }

  if(animeRecommendations.data && animeRecommendations.data.length === 0){
    return(
      <p className=" text-center text-xl font-medium text-white">No recommendations found ...</p>
    )
  }
}
