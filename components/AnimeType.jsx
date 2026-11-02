"use client";
import React, { useState, useEffect } from "react";
import AnimeBox from "./AnimeBox";
import { nanoid } from "nanoid";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";
import { Fira_Sans } from "next/font/google";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: "700",
});

const AnimeType = ({ animeTypeName, url }) => {
  const [animeData, setAnimeData] = useState({
    error: false,
    loading: false,
    data: [],
  });

  async function getAnime() {
    try {
      setAnimeData((prev) => ({ ...prev, loading: true }));
      const isMal =
        typeof url === "string" && url.includes("api.myanimelist.net");
      const fetchUrl = isMal
        ? `/api/mal?url=${encodeURIComponent(url)}`
        : url;
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch anime data");
      }
      const data = await response.json();
      setAnimeData({
        error: false,
        loading: false,
        data: Array.isArray(data.data) ? data.data : [],
      });
    } catch (error) {
      console.log(error);
      setAnimeData({ error: true, loading: false, data: [] });
    }
  }

  useEffect(() => {
    getAnime();
  }, [url]);

  return (
    <div className=" mt-[4rem] max-w-6xl flex flex-col gap-7 items-center mx-auto">
      <div className=" flex flex-row justify-between w-full">
        <div className=" self-center w-full flex flex-col gap-1">
          <h1
            className={` ${firaSans.className} text-white text-xl font-bold md:text-3xl`}
          >
            {animeTypeName}
          </h1>
          <span className=" p-1 rounded-xl bg-blue-800 w-[10%]" />
        </div>
        <Link
          className=" text-gray-300 flex flex-row justify-center items-center font-semibold self-center hover:translate-x-2 duration-300 hover:text-gray-400"
          href={
            animeTypeName === "Top Anime"
              ? "/recent-anime"
              : animeTypeName === "Upcoming Next Season"
                ? "/top-anime"
                : animeTypeName === "All Time Popular"
                  ? "/upcoming-anime"
                  : animeTypeName === "Recent Anime"
                    ? "/popular-anime"
                    : ""
          }
        >
          <p className=" self-center font-medium text-lg">
            {animeTypeName === "Top Anime"
              ? "Recent"
              : animeTypeName === "Upcoming Next Season"
                ? "Top"
                : animeTypeName === "All Time Popular"
                  ? "Upcoming"
                  : animeTypeName === "Recent Anime"
                    ? "Popular"
                    : ""}
          </p>
          {animeTypeName !== "New Releases" && <span>⏭️</span>}
        </Link>
      </div>
      {animeData.error === true ? (
        <p className="text-center w-full mt-10 text-xl text-red-500">
          Try again...
        </p>
      ) : animeData.loading === true ? (
        <div className="w-full mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5 sm:gap-2">
              <Skeleton className="rounded-lg bg-gray-300/30 w-full aspect-[9/13]" />
              <Skeleton className="h-4 w-3/4 bg-gray-300/30 rounded" />
            </div>
          ))}
        </div>
      ) : (
        animeData.data &&
        (animeData.data.length === 0 ? (
          <p className=" text-center text-xl font-medium h-[15rem] text-white">
            No anime found...
          </p>
        ) : (
          <div className="w-full mt-5 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {animeData.data
              .filter((anime, index, self) => {
                const id = anime.node?.id ?? anime.mal_id;
                return (
                  index ===
                  self.findIndex((a) => (a.node?.id ?? a.mal_id) === id)
                );
              })
              .map((anime) => {
                const node = anime.node;
                const animeId = node?.id ?? anime.mal_id;
                const animeImage =
                  node?.main_picture?.large ||
                  node?.main_picture?.medium ||
                  anime.images?.jpg?.large_image_url ||
                  anime.images?.jpg?.image_url;
                const animeName =
                  node?.alternative_titles?.en ||
                  node?.title ||
                  anime.title_english ||
                  anime.title;
                const year =
                  node?.start_season?.year ??
                  anime.year ??
                  anime.aired?.prop?.from?.year ??
                  0;
                const season =
                  node?.start_season?.season ?? anime.season ?? "Unknown";
                const genres = Array.isArray(node?.genres)
                  ? node.genres.map((g) => g.name)
                  : Array.isArray(anime.genres)
                    ? anime.genres.map((g) =>
                        typeof g === "object" && g !== null ? g.name : g,
                      )
                    : [];

                return (
                  <div key={nanoid(10)}>
                    <AnimeBox
                      animeId={animeId}
                      animeImage={animeImage}
                      animeName={animeName}
                      year={year}
                      season={season}
                      genres={genres}
                    />
                  </div>
                );
              })}
          </div>
        ))
      )}
    </div>
  );
};

export default AnimeType;
