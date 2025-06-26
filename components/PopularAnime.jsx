"use client";
import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { nanoid } from "nanoid";
import fetchAnime from "../utils/fetchAnime";
import { useState, useEffect } from "react";

export default function PopularAnime() {
  const [animeData, setAnimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getPopularAnime() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAnime("https://api.jikan.moe/v4/top/anime?filter=bypopularity");

      setAnimeData(data.data);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPopularAnime();
  }, []);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className=" flex flex-row justify-between">
        <h1 className="text-gray-300 uppercase font-bold text-xl">
          all time popular
        </h1>
        <Link className=" text-gray-500 font-medium" href={"/"}>
          View All
        </Link>
      </div>
      {animeData && (
        <div className="flex flex-row gap-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 sm:overflow-x-visible">
          {animeData
            .filter(
              (anime, index, self) =>
                index === self.findIndex((a) => a.mal_id === anime.mal_id)
            )
            .slice(0, 5)
            ?.map((anime) => (
              <Link key={nanoid(10)} href={"/"}>
                <div className="flex flex-col gap-2 min-w-[180px]">
                  <Image
                    src={
                      anime.images.jpg.large_image_url
                        ? anime.images.jpg.large_image_url
                        : anime.images.jpg.image_url
                    }
                    width={180}
                    height={200}
                    alt={anime.title}
                    className=" rounded-lg border border-gray-900 object-cover"
                  />
                  <h2 className="text-gray-300 text-sm font-medium w-[200px]">
                    {anime.title_english ? anime.title_english : anime.title}
                  </h2>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
