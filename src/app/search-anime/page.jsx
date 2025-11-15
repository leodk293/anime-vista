"use client";
import React, { Suspense } from "react";
import Loader from "../../../components/loader/Loader";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import AnimeBox from "../../../components/AnimeBox";

function SearchAnimeContent() {
  const searchParams = useSearchParams();
  const [searchState, setSearchState] = useState({
    query: "",
    error: false,
    loading: false,
    data: [],
  });

  const animeName = useMemo(
    () => searchParams.get("anime") || "",
    [searchParams]
  );

  const fetchAnime = async (query) => {
    if (!query) return;

    setSearchState((prev) => ({
      ...prev,
      loading: true,
      error: false,
    }));

    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${query}&order_by=popularity&sort=asc&sfw`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data } = await response.json();

      setSearchState((prev) => ({
        ...prev,
        loading: false,
        data,
        query,
      }));
    } catch (error) {
      console.error("Error fetching anime:", error);
      setSearchState((prev) => ({
        ...prev,
        loading: false,
        error: true,
        data: [],
      }));
    }
  };

  useEffect(() => {
    fetchAnime(animeName);
  }, [animeName]);

  if (searchState.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl text-red-500">
          Something went wrong. Please try again.
        </h1>
      </div>
    );
  }

  if (searchState.loading) {
    return <Loader />;
  }

  if (searchState.data.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl font-medium text-white">No result found</h1>
      </div>
    );
  }

  if (searchState.data) {
    return (
      <div className=" mt-[4rem] max-w-5xl flex flex-col gap-7 items-center mx-auto">
        <div className=" w-full flex flex-col gap-1">
          <h1 className=" text-white text-3xl font-bold">
            Results for {animeName}
          </h1>
          <span className=" p-1 rounded-xl bg-blue-800 w-[10%]" />
        </div>

        <div className="w-full mt-5 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {searchState.data
            .filter(
              (anime, index, self) =>
                index === self.findIndex((a) => a.mal_id === anime.mal_id)
            )
            .map((anime) => (
              <div key={nanoid(10)}>
                <AnimeBox
                  animeId={anime.mal_id}
                  animeImage={
                    anime.images?.jpg?.large_image_url
                      ? anime.images.jpg.large_image_url
                      : anime.images?.jpg?.image_url
                  }
                  animeName={
                    anime.title_english
                      ? anime.title_english
                      : anime.title
                  }
                  year={anime.year ?? 0}
                  season={anime.season ?? "Unknown"}
                  genres={Array.isArray(anime.genres) && anime.genres.length > 0 ? anime.genres.map(g => typeof g === 'object' && g !== null ? g.name : g) : []}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default function SearchAnimePage() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchAnimeContent />
    </Suspense>
  );
}
