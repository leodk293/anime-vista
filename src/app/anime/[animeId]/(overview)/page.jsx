"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Loader from "../../../../../components/loader/Loader";
import Link from "next/link";
import AnimeStaff from "../../../../../components/AnimeStaff";
import AnimeCharacters from "../../../../../components/AnimeCharacters";

export default function AnimePage({ params }) {
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;

  const [animeData, setAnimeData] = useState({
    error: false,
    loading: true,
    data: null,
    errorMessage: "",
  });

  const [animeCharacters, setAnimeCharacters] = useState({
    data: [],
    loading: true,
    error: false,
    errorMessage: "",
  });

  async function fetchAnimeData() {
    setAnimeData((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/full`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch anime data: ${response.status}`);
      }
      const data = await response.json();
      setAnimeData({
        error: false,
        loading: false,
        data: data.data,
        errorMessage: "",
      });
    } catch (error) {
      console.error(error);
      setAnimeData({
        error: true,
        loading: false,
        data: null,
        errorMessage: "Failed to load anime details. Please try again later.",
      });
    }
  }

  useEffect(() => {
    if (!animeId) {
      setAnimeData({
        error: true,
        loading: false,
        data: null,
        errorMessage: "Invalid anime ID provided.",
      });
      return;
    }
    fetchAnimeData();
  }, [animeId]);

  if (!animeId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-xl text-red-500">Invalid anime ID provided.</h1>
      </div>
    );
  }

  if (animeData.loading) {
    return <Loader />;
  }

  if (animeData.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-xl text-red-500">{animeData.errorMessage}</h1>
        <button
          onClick={fetchAnimeData}
          className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="text-white flex flex-col gap-10 ">
      <section className="flex flex-col gap-5">
        <Link href={`/anime/${animeId}/characters`}>
          <h1 className="text-xl sm:text-2xl font-bold hover:text-gray-400 duration-300">Characters</h1>
        </Link>
        <AnimeCharacters animeId={animeId} length={8} />
      </section>

      <section className="flex flex-col gap-5">
        <Link href={`/anime/${animeId}/staff`}>
          <h1 className="text-xl sm:text-2xl font-bold hover:text-gray-400 duration-300">Staff</h1>
        </Link>
        <AnimeStaff animeId={animeId} length={4} />
      </section>

      <section className="flex flex-col gap-5">
        <h1 className="text-xl sm:text-2xl font-bold">Trailer</h1>
        {animeData.data &&
          (animeData.data.trailer ? (
            <div className="w-full bg-gray-900">
              <iframe
                className="w-full border border-gray-800 rounded-sm h-[15rem] sm:h-[20rem] md:h-[25rem] lg:h-[30rem]"
                src={
                  animeData.data?.trailer?.embed_url
                    ? animeData.data?.trailer?.embed_url.replace(
                        "autoplay=1",
                        "autoplay=0"
                      )
                    : undefined
                }
                title={`${animeData.data?.title_english} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <p className="text-sm text-gray-700 italic">
              No trailer available...
            </p>
          ))}
      </section>
    </div>
  );
}
