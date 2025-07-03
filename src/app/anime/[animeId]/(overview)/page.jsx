"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Loader from "../../../../../components/loader/Loader";
import Link from "next/link";
import Image from "next/image";
import { nanoid } from "nanoid";
import { ArrowRightLeft, ArrowLeftRight } from "lucide-react";
import AnimeStaff from "../../../../../components/AnimeStaff";

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

  const [animeStaff, setAnimeStaff] = useState({
    data: [],
    loading: true,
    error: false,
    errorMessage: "",
  });

  const [animeRecommendations, setAnimeRecommendations] = useState({
    data: [],
    loading: true,
    error: false,
    errorMessage: "",
  });
  const [moreRecommended, setMoreRecommended] = useState(6);
  function handleRecommendationDisplay() {
    if (moreRecommended === 6) {
      setMoreRecommended(animeRecommendations.data.length);
    } else {
      setMoreRecommended(6);
    }
  }

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

  async function fetchAnimeCharacters() {
    setAnimeCharacters((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/characters`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch characters: ${response.status}`);
      }
      const result = await response.json();
      setAnimeCharacters({
        data: result.data,
        loading: false,
        error: false,
        errorMessage: "",
      });
    } catch (error) {
      console.error(error);
      setAnimeCharacters({
        data: [],
        loading: false,
        error: true,
        errorMessage: "Failed to load characters. Please try again later.",
      });
    }
  }

  async function fetchAnimeStaff() {
    setAnimeStaff((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/staff`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch staff: ${response.status}`);
      }
      const result = await response.json();
      setAnimeStaff({
        data: result.data,
        loading: false,
        error: false,
        errorMessage: "",
      });
    } catch (error) {
      console.error(error);
      setAnimeStaff({
        data: [],
        loading: false,
        error: true,
        errorMessage:
          "Failed to load staff information. Please try again later.",
      });
    }
  }

  async function fetchAnimeRecommendations() {
    setAnimeRecommendations((prev) => ({
      ...prev,
      loading: true,
      error: false,
    }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/recommendations`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations : ${response.status}`);
      }
      const result = await response.json();
      setAnimeRecommendations({
        data: result.data,
        loading: false,
        error: false,
        errorMessage: "",
      });
    } catch (error) {
      console.error(error);
      setAnimeStaff({
        data: [],
        loading: false,
        error: true,
        errorMessage: "Failed to load recommendations. Please try again later.",
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
    fetchAnimeCharacters();
    fetchAnimeStaff();
    fetchAnimeRecommendations();
  }, [animeId]);

  if (!animeId) {
    return (
      <div className="flex items-center justify-center h-full">
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
        <h1 className="text-xl sm:text-2xl font-bold">Characters</h1>
        {animeCharacters.loading ? (
          <Loader />
        ) : animeCharacters.error ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-500">{animeCharacters.errorMessage}</p>
            <button
              onClick={fetchAnimeCharacters}
              className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {animeCharacters.data?.length > 0 ? (
              animeCharacters.data.slice(0, 8).map((element) => (
                <div
                  className="flex flex-row items-center border border-gray-800 w-full justify-between bg-[#151f2e] rounded-lg"
                  key={element.character.mal_id}
                >
                  <div className="flex flex-row items-center gap-2 sm:gap-4 w-1/2">
                    <div className="relative w-[60px] h-[80px] sm:w-[80px] sm:h-[100px]">
                      <Image
                        src={element.character.images.jpg.image_url}
                        alt={element.character.name}
                        fill
                        className="object-cover rounded-tl-md rounded-bl-md"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                    <div className="flex flex-col text-xs sm:text-sm gap-4 sm:gap-10">
                      <p className="font-semibold line-clamp-1">
                        {element.character.name}
                      </p>
                      <p className="text-gray-400">{element.role}</p>
                    </div>
                  </div>

                  {element.voice_actors &&
                  element.voice_actors.some(
                    (va) =>
                      va.language && va.language.toLowerCase() === "japanese"
                  )
                    ? element.voice_actors
                        .filter(
                          (va) =>
                            va.language &&
                            va.language.toLowerCase() === "japanese"
                        )
                        .slice(0, 1)
                        .map((va) => (
                          <div
                            className="flex flex-row items-center gap-2 sm:gap-4 w-1/2 justify-end"
                            key={va.person.mal_id}
                          >
                            <div className="flex flex-col text-xs sm:text-sm gap-4 sm:gap-10 text-right">
                              <p className="font-semibold line-clamp-1">
                                {va.person.name}
                              </p>
                              <p className="text-gray-400">{va.language}</p>
                            </div>
                            <div className="relative w-[60px] h-[80px] sm:w-[80px] sm:h-[100px]">
                              <Image
                                src={va.person.images.jpg.image_url}
                                alt={va.person.name}
                                fill
                                className="object-cover rounded-tr-md rounded-br-md"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                          </div>
                        ))
                    : null}
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                No character information available
              </p>
            )}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-5">
        <h1 className="text-xl sm:text-2xl font-bold">Staff</h1>
        <AnimeStaff animeId={animeId} slice={4} />
      </section>

      <section className="flex flex-col gap-5">
        <h1 className="text-xl sm:text-2xl font-bold">Trailer</h1>
        {animeData.data &&
          (animeData.data.trailer ? (
            <div className="w-full bg-gray-900">
              <iframe
                className="w-full border border-gray-800 rounded-sm h-[15rem] sm:h-[20rem] md:h-[25rem] lg:h-[30rem]"
                src={animeData.data.trailer.embed_url}
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

      {animeRecommendations.data.length > 0 && (
        <section className="flex flex-col gap-5">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold">Recommendations</h1>
            {animeRecommendations.data.length >= 6 && (
              <button
                onClick={handleRecommendationDisplay}
                className="text-gray-400 flex flex-row justify-center items-center gap-2 cursor-pointer font-medium capitalize text-sm sm:text-base"
              >
                {moreRecommended === 6 ? (
                  <ArrowRightLeft className=" hidden md:block" size={18} />
                ) : (
                  <ArrowLeftRight className=" hidden md:block" size={18} />
                )}
                {moreRecommended === 6 ? (
                  <p>view all recommendations</p>
                ) : (
                  <p>show less</p>
                )}
              </button>
            )}
          </div>
          {animeRecommendations.loading ? (
            <Loader />
          ) : animeRecommendations.error ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-red-500">
                {animeRecommendations.errorMessage}
              </p>
              <button
                onClick={fetchAnimeRecommendations}
                className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeRecommendations.data?.length > 0 ? (
                animeRecommendations.data
                  .slice(0, moreRecommended)
                  .map((element) => (
                    <Link
                      key={element?.entry?.mal_id}
                      href={`/anime/${element?.entry?.mal_id}`}
                      className="flex flex-col gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity duration-200"
                    >
                      <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                        <Image
                          src={element?.entry?.images?.jpg?.large_image_url}
                          width={150}
                          height={180}
                          alt={element?.entry?.title}
                          className="rounded-lg border border-gray-700 object-cover aspect-[9/13] w-full"
                        />
                        <h2 className="text-gray-300 w-full text-xs sm:text-sm font-medium line-clamp-2">
                          {element?.entry?.title}
                        </h2>
                      </div>
                    </Link>
                  ))
              ) : (
                <p className="text-gray-400">No recommendations found</p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
