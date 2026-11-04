"use client";
import React, { Suspense } from "react";
import Loader from "../../../components/loader/Loader";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import AnimeBox from "../../../components/AnimeBox";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function SearchAnimeContent() {
  const searchParams = useSearchParams();
  const [searchState, setSearchState] = useState({
    query: "",
    error: false,
    errorMessage: "",
    loading: false,
    data: [],
  });

  const abortRef = useRef(null);

  const animeName = useMemo(
    () => searchParams.get("anime") || "",
    [searchParams],
  );

  const fetchAnime = async (query, { retries = 3, signal } = {}) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(
          `/api/anime-search?q=${encodeURIComponent(query)}`,
          { signal },
        );

        // Retry on rate limit or server/gateway errors
        if (!response.ok) {
          if (
            (response.status === 429 || response.status >= 500) &&
            attempt < retries
          ) {
            const delay = 500 * Math.pow(2, attempt); // 500ms, 1s, 2s...
            await sleep(delay);
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        if (error.name === "AbortError") throw error; // don't retry aborts
        if (attempt === retries) throw error;
        await sleep(500 * Math.pow(2, attempt));
      }
    }
  };

  useEffect(() => {
    if (!animeName) return;

    // Cancel any in-flight request from a previous query
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSearchState((prev) => ({
      ...prev,
      loading: true,
      error: false,
    }));

    fetchAnime(animeName, { signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        setSearchState((prev) => ({
          ...prev,
          loading: false,
          data: result?.data ?? [],
          query: animeName,
        }));
      })
      .catch((error) => {
        if (error.name === "AbortError") return; // ignore, superseded by newer request
        console.error("Error fetching anime:", error);
        setSearchState((prev) => ({
          ...prev,
          loading: false,
          error: true,
          errorMessage: error.message || "Unable to fetch results.",
          data: [],
        }));
      });

    return () => controller.abort();
  }, [animeName]);

  if (searchState.error) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold text-red-500">
          Unable to load search results for "{animeName}".
        </h1>
        {/* <p className="max-w-xl text-sm text-gray-300">
          {searchState.errorMessage}
        </p> */}
        <p className="max-w-xl text-sm text-white/80">
          Please try again in a moment or check your network connection.
        </p>
      </div>
    );
  }

  if (searchState.loading) {
    return (
      <div className="w-full mx-auto max-w-6xl mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5 sm:gap-2">
            <Skeleton className="rounded-lg bg-gray-300/30 w-full aspect-[9/13]" />
            <Skeleton className="h-4 w-3/4 bg-gray-300/30 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (searchState.data.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold text-white">
          No results found for "{animeName}".
        </h1>
        <p className="max-w-xl text-sm text-white/80">
          Try a different title, remove special characters, or use fewer words.
        </p>
      </div>
    );
  }

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
              index ===
              self.findIndex((item) => item.node?.id === anime.node?.id),
          )
          .map((anime) => (
            <div key={nanoid(10)}>
              <AnimeBox
                animeId={anime.node?.id}
                animeImage={anime.node?.main_picture?.large}
                animeName={anime.node?.title}
                year={anime.node.start_season?.year ?? 0}
                season={anime.node.start_season?.season ?? "Unknown"}
                genres={
                  Array.isArray(anime.node.genres) && anime.node.genres.length > 0
                    ? anime.node.genres.map((g) =>
                        typeof g === "object" && g !== null ? g.name : g,
                      )
                    : []
                }
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default function SearchAnimePage() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchAnimeContent />
    </Suspense>
  );
}
