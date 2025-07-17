"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Loader from "./loader/Loader";
import Link from "next/link";

export default function AnimeCharacters({ animeId, length }) {
  const [animeCharacters, setAnimeCharacters] = useState({
    data: [],
    loading: true,
    error: false,
    errorMessage: "",
  });

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

  useEffect(() => {
    fetchAnimeCharacters();
  }, [animeId]);

  if (animeCharacters.loading) {
    return <Loader />;
  }

  if (animeCharacters.error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-500">{animeCharacters.errorMessage}</p>
        <button
          onClick={fetchAnimeCharacters}
          className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (animeCharacters.data && animeCharacters.data.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {animeCharacters.data?.length > 0 ? (
          animeCharacters.data
            .slice(0, length !== 0 ? length : animeCharacters.data.length)
            .map((element) => (
              <div
                className="flex flex-row items-center border border-gray-200/30 w-full justify-between bg-white/5 rounded-lg"
                key={element.character.mal_id}
              >
                <div className="flex flex-row items-center gap-2 sm:gap-4 w-1/2">
                  <div className="relative w-[60px] h-[80px] sm:w-[80px] sm:h-[100px]">
                    <Link
                      href={`/${animeId}/character/${element.character.mal_id}`}
                    >
                      <Image
                        src={element.character.images.jpg.image_url}
                        alt={element.character.name}
                        fill
                        className="object-cover rounded-tl-md rounded-bl-md"
                      />
                    </Link>
                  </div>
                  <div className="flex flex-col text-xs sm:text-sm gap-4 sm:gap-10">
                    <p className="font-semibold line-clamp-1">
                      {element.character.name}
                    </p>
                    <p className="text-gray-300 font-medium">{element.role}</p>
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
                            <p className="text-gray-300 font-medium">{va.language}</p>
                          </div>
                          <Link href={`/voice-actor/${va.person.mal_id}`}>
                            <div className="relative w-[60px] h-[80px] sm:w-[80px] sm:h-[100px]">
                              <Image
                                src={va.person.images.jpg.image_url}
                                alt={va.person.name}
                                fill
                                className="object-cover rounded-tr-md rounded-br-md"
                              />
                            </div>
                          </Link>
                        </div>
                      ))
                  : null}
              </div>
            ))
        ) : (
          <p className="text-gray-400">No character information available</p>
        )}
      </div>
    );
  }
}
