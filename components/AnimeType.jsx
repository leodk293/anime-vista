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
      const response = await fetch(`${url}`);
      if (!response.ok) {
        throw new Error("Failed to fetch anime data");
      }
      const data = await response.json();
      setAnimeData({ error: false, loading: false, data: data.data });
    } catch (error) {
      console.log(error);
      setAnimeData({ error: true, loading: false, data: [] });
    }
  }

  useEffect(() => {
    getAnime();
  }, []);

  return (
    <div className=" mt-[4rem] max-w-5xl flex flex-col gap-7 items-center mx-auto">
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
          <p className=" self-center text-lg md:text-2xl">
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
          {animeTypeName !== "New Releases" && (
            <ArrowBigRight
              className=" self-center"
              size={35}
              strokeWidth={1.65}
            />
          )}
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
              .filter(
                (anime, index, self) =>
                  index === self.findIndex((a) => a.mal_id === anime.mal_id),
              )
              .map((anime) => (
                <div key={nanoid(10)}>
                  <AnimeBox
                    animeId={anime.mal_id}
                    animeImage={
                      anime.images?.jpg?.large_image_url
                        ? anime.images.jpg.large_image_url
                        : anime.images?.jpg?.image_url || ""
                    }
                    animeName={anime.title_english || anime.title}
                    year={anime.year || (anime.aired?.prop?.from?.year ?? "")}
                    season={anime?.season}
                    genres={
                      Array.isArray(anime.genres)
                        ? anime.genres.map((g) =>
                            typeof g === "object" && g !== null ? g.name : g,
                          )
                        : []
                    }
                  />
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AnimeType;
