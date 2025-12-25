"use client";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import Image from "next/image";
import Loader from "./loader/Loader";
import Link from "next/link";

export default function MangaCharacters({ mangaId, length = 0 }) {
  const [mangaCharacters, setMangaCharacters] = useState({
    error: false,
    loading: false,
    data: [],
  });

  const getCharacters = useCallback(async () => {
    setMangaCharacters({
      error: false,
      loading: true,
      data: [],
    });

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/manga/${mangaId}/characters`
      );
      if (!res.ok) {
        throw new Error("An error has occurred");
      }
      const result = await res.json();
      setMangaCharacters({
        error: false,
        loading: false,
        data: result.data || [],
      });
    } catch (error) {
      console.error(error.message);
      setMangaCharacters({
        error: true,
        loading: false,
        data: [],
      });
    }
  }, [mangaId]);

  useEffect(() => {
    if (!mangaId) return;

    let cancelled = false;

    const fetchCharacters = async () => {
      setMangaCharacters({
        error: false,
        loading: true,
        data: [],
      });

      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/manga/${mangaId}/characters`
        );
        if (!res.ok) {
          throw new Error("An error has occurred");
        }
        const result = await res.json();

        if (!cancelled) {
          setMangaCharacters({
            error: false,
            loading: false,
            data: result.data || [],
          });
        }
      } catch (error) {
        console.error(error.message);
        if (!cancelled) {
          setMangaCharacters({
            error: true,
            loading: false,
            data: [],
          });
        }
      }
    };

    fetchCharacters();

    return () => {
      cancelled = true;
    };
  }, [mangaId]);

  if (mangaCharacters.error) {
    return (
      <div className="flex flex-col gap-2 items-center mt-5">
        <p className="text-red-400 text-base italic">
          Failed to load characters.
        </p>
        <button
          className="border border-transparent rounded-xl px-4 py-2 text-white bg-blue-900 cursor-pointer hover:bg-blue-800 transition-colors"
          onClick={getCharacters}
        >
          Try again
        </button>
      </div>
    );
  }

  if (mangaCharacters.loading) {
    return <Loader />;
  }

  if (!mangaCharacters.data || mangaCharacters.data.length === 0) {
    return (
      <p className="text-center font-medium text-white">No characters found</p>
    );
  }

  const displayCount = length === 0 ? mangaCharacters.data.length : length;
  const charactersToShow = mangaCharacters.data.slice(0, displayCount);

  return (
    <section>
      <div className="flex flex-wrap gap-3">
        {charactersToShow.map((character) => (
          <div
            key={character.character.mal_id}
            className="bg-white/5 rounded-lg px-3 py-2 flex flex-col items-center border border-white/10 w-32"
          >
            <Link href={`/manga-character/${character.character.mal_id}`}>
              <Image
                src={character.character.images.jpg.image_url}
                alt={character.character.name}
                width={100}
                height={120}
                className="rounded-lg border border-gray-700 object-cover"
              />
            </Link>
            <div className="text-xs text-white font-medium mt-2 text-center">
              {character.character.name}
            </div>
            <div className="text-xs text-gray-300 text-center">
              {character.role}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
