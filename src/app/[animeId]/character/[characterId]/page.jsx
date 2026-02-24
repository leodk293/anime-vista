"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Loader from "../../../../../components/loader/Loader";
import ReadMore from "../../../../../components/readMore";
import AnimeBox from "../../../../../components/AnimeBox";

export default function CharacterPage({ params }) {
  const resolvedParams = use(params);
  const { animeId, characterId } = resolvedParams;

  const [animePoster, setAnimePoster] = useState(null);
  const [animeCharacterData, setAnimeCharacterData] = useState({
    error: false,
    loading: false,
    data: null,
  });
  const [genresMap, setGenresMap] = useState({});

  async function getAnimePoster() {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
      if (!res.ok) throw new Error("Failed to fetch anime data");
      const result = await res.json();
      setAnimePoster(result.data.images.jpg.large_image_url);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getAnimeCharacterData() {
    setAnimeCharacterData((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/characters/${characterId}/full`
      );
      if (!response.ok) {
        setAnimeCharacterData((prev) => ({ ...prev, loading: false, error: true }));
        throw new Error("Failed to fetch character data");
      }
      const result = await response.json();
      setAnimeCharacterData((prev) => ({ ...prev, loading: false, data: result.data }));
    } catch (error) {
      console.error(error.message);
      setAnimeCharacterData((prev) => ({ ...prev, loading: false, error: true }));
    }
  }

  async function loadGenres(id) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
    const data = await res.json();
    setGenresMap((prev) => ({ ...prev, [id]: data.data?.genres ?? [] }));
  }

  useEffect(() => { getAnimePoster(); }, [animeId]);
  useEffect(() => { getAnimeCharacterData(); }, [characterId]);

  useEffect(() => {
    if (animeCharacterData?.data?.anime?.length > 0) {
      animeCharacterData.data.anime.forEach((element) => {
        if (element?.anime?.mal_id) loadGenres(element.anime.mal_id);
      });
    }
  }, [animeCharacterData.data]);

  if (!animeId || !characterId) {
    return (
      <div className="flex items-center justify-center mt-40">
        <h1 className="text-xl text-red-500">Invalid ID provided.</h1>
      </div>
    );
  }

  if (animeCharacterData.loading) return <Loader />;

  if (animeCharacterData.error) {
    return (
      <div className="flex items-center justify-center mt-40">
        <h1 className="text-xl text-red-500">
          Failed to load character data. Please try again later.
        </h1>
      </div>
    );
  }

  const data = animeCharacterData.data;

  return (
    <>
      {/* Blurred background poster */}
      {animePoster && (
        <div className="fixed inset-0 -z-10 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900" />
          <Image
            src={animePoster}
            alt="Background"
            fill
            className="object-cover blur-sm"
            priority
          />
        </div>
      )}

      {data && (
        <div className="relative max-w-5xl text-white pt-24 pb-16 mx-auto px-4 flex flex-col gap-16">

          {/* ── HERO ── */}
          <section className="flex flex-col md:flex-row gap-10 items-start">

            {/* Portrait */}
            {data.images?.jpg?.image_url && (
              <div className="relative flex-shrink-0 self-center md:self-start">
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-blue-500/40 via-transparent to-blue-900/30 z-0" />
                <Image
                  width={220}
                  height={320}
                  src={data.images.jpg.image_url}
                  alt={data.name}
                  className="relative z-10 rounded-xl object-cover w-[220px] h-[320px] shadow-2xl shadow-black/60"
                />
                <span className="absolute bottom-3 left-3 z-20 bg-blue-600/80 backdrop-blur-sm text-white text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full">
                  Character
                </span>
              </div>
            )}

            {/* Info */}
            <div className="flex flex-col gap-5 flex-1">

              {/* Name block */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-blue-400 flex items-center gap-2">
                  <span className="inline-block w-6 h-px bg-blue-400" />
                  Character
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                  {data.name}
                </h1>
                {data.name_kanji && (
                  <p className="text-lg text-gray-400 font-medium italic">
                    {data.name_kanji}
                  </p>
                )}
                {data.nicknames?.length > 0 && (
                  <p className="text-xs text-gray-500 tracking-widest mt-1">
                    {data.nicknames.join("  ·  ")}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-blue-800/60 to-transparent" />

              {/* Meta row — favorites */}
              {data.favorites != null && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-blue-400 w-16">
                    Fans
                  </span>
                  <span className="text-sm text-gray-300">
                    {data.favorites.toLocaleString()} favorites
                  </span>
                </div>
              )}

              {/* About */}
              {data.about ? (
                <div className="border-l-2 border-blue-800/60 pl-4 max-w-2xl">
                  <ReadMore
                    text={data.about}
                    textSize="text-sm"
                    maxLength={500}
                  />
                </div>
              ) : (
                <p className="text-sm italic text-gray-600">
                  No biography available.
                </p>
              )}
            </div>
          </section>

          {/* ── PRESENT IN ── */}
          {data.anime?.length > 0 && (
            <section className="flex flex-col gap-6">
              <div className="flex items-baseline gap-4">
                <h2 className="text-2xl font-bold text-white">Present in</h2>
                <span className="text-xs font-semibold tracking-widest uppercase text-blue-400">
                  {data.anime.length} titles
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-800/50 to-transparent" />
              </div>
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.anime.map((element) => (
                  <AnimeBox
                    key={element?.anime?.mal_id}
                    animeId={element?.anime?.mal_id}
                    animeImage={
                      element?.anime?.images?.jpg?.large_image_url ||
                      element?.anime?.images?.jpg?.image_url ||
                      ""
                    }
                    animeName={
                      element?.anime?.title_english || element?.anime?.title
                    }
                    year={
                      element?.anime?.year ??
                      element?.anime?.aired?.prop?.from?.year ??
                      0
                    }
                    season={element?.anime?.season ?? "Unknown"}
                    genres={
                      Array.isArray(genresMap[element?.anime?.mal_id]) &&
                      genresMap[element?.anime?.mal_id].length > 0
                        ? genresMap[element?.anime?.mal_id].map((g) =>
                            typeof g === "object" && g !== null ? g.name : g
                          )
                        : []
                    }
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </>
  );
}