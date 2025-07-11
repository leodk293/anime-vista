"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Loader from "../../../../../components/loader/Loader";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";

export default function CharactersPage({ params }) {
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;

  const [animeCharacters, setAnimeCharacters] = useState({
    data: [],
    loading: true,
    error: false,
  });

  async function getAnimeCharacters() {
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
      });
    } catch (error) {
      console.error(error);
      setAnimeCharacters((prev) => ({ ...prev, loading: false, error: true }));
    }
  }

  useEffect(() => {
    getAnimeCharacters();
  }, [animeId]);

  if (animeCharacters.loading) {
    return <Loader />;
  }

  if (animeCharacters.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-xl text-red-500">
          Something went wrong, try again
        </h1>
      </div>
    );
  }

  return (
    <div className=" text-white flex flex-col gap-10">
      <div className=" flex flex-col gap-2">
        <h1 className="text-xl font-bold">Characters</h1>
        <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {animeCharacters.data &&
          animeCharacters.data.length > 0 &&
          animeCharacters.data.map((character) => (
            <div
              className="flex flex-row items-center border border-gray-200/30 w-full justify-between bg-white/5 rounded-lg"
              key={character.character.mal_id}
            >
              <div className="flex flex-row items-center gap-2 sm:gap-4 w-1/2">
                <div className="relative w-[60px] h-[80px] sm:w-[80px] sm:h-[100px]">
                  <Link
                    href={`/${animeId}/character/${character.character.mal_id}`}
                  >
                    <Image
                      src={character.character.images.jpg.image_url}
                      alt={character.character.name}
                      fill
                      className="object-cover rounded-tl-md rounded-bl-md"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </Link>
                </div>
                <div className="flex flex-col text-xs sm:text-sm gap-4 sm:gap-10">
                  <p className="font-semibold line-clamp-1">
                    {character.character.name}
                  </p>
                  <p className="text-gray-400">{character.role}</p>
                </div>
              </div>

              {character.voice_actors &&
              character.voice_actors.some(
                (va) => va.language && va.language.toLowerCase() === "japanese"
              )
                ? character.voice_actors
                    .filter(
                      (va) =>
                        va.language && va.language.toLowerCase() === "japanese"
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
                        <Link href={`/voice-actor/${va.person.mal_id}`}>
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
                        </Link>
                      </div>
                    ))
                : null}
            </div>
          ))}
      </div>
    </div>
  );
}
