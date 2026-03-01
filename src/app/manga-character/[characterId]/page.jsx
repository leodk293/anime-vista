"use client";
import React, { useState, useEffect, use } from "react";
import Loader from "../../../../components/loader/Loader";
import ReadMore from "../../../../components/readMore";
import Image from "next/image";
import Link from "next/link";
import { nanoid } from "nanoid";

export default function MangaCharacter({ params }) {
  const resolvedParams = use(params);
  const characterId = resolvedParams.characterId;

  const [character, setCharacter] = useState({
    error: false,
    data: null,
    loading: false,
  });

  const [manga, setManga] = useState([]);

  async function getCharacterData() {
    setCharacter({ error: false, data: null, loading: true });
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/characters/${characterId}`,
      );
      if (!res.ok) throw new Error("An error has occurred");
      const result = await res.json();
      setCharacter({ error: false, data: result.data, loading: false });
    } catch (error) {
      console.error(error.message);
      setCharacter({ error: true, data: null, loading: false });
    }
  }

  async function getManga() {
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/characters/${characterId}/manga`,
      );
      if (!res.ok) throw new Error("Error occurred");
      const result = await res.json();
      setManga(result.data);
    } catch (error) {
      console.error(error.message);
      setManga([]);
    }
  }

  useEffect(() => {
    getCharacterData();
    getManga();
  }, [characterId]);

  if (character.loading) return <Loader />;

  if (character.error) {
    return (
      <div className="flex items-center justify-center mt-40">
        <h1 className="text-xl text-red-500">
          Failed to load character data. Please try again later.
        </h1>
      </div>
    );
  }

  if (!character.data || !characterId) return null;

  const data = character.data;

  return (
    <div className="relative max-w-6xl text-white pt-24 pb-16 mx-auto px-4 flex flex-col gap-16">
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

          {/* Favorites */}
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
              <ReadMore text={data.about} textSize="text-sm" maxLength={500} />
            </div>
          ) : (
            <p className="text-sm italic text-gray-600">
              No biography available.
            </p>
          )}
        </div>
      </section>

      {/* ── MANGA ── */}
      {manga?.length > 0 && (
        <section className="flex flex-col gap-6">
          <div className="flex items-baseline gap-4">
            <h2 className="text-2xl font-bold text-white">Present in</h2>
            <span className="text-xs font-semibold tracking-widest uppercase text-blue-400">
              {manga.length} titles
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-800/50 to-transparent" />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {manga.map((element) => (
              <Link
                key={nanoid(10)}
                href={`/manga/${element.manga.mal_id}`}
                className="group flex flex-col gap-2"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-900 ring-1 ring-white/5 group-hover:ring-blue-500/40 transition-all duration-300">
                  {element.manga.images?.jpg?.large_image_url && (
                    <Image
                      fill
                      src={element.manga.images.jpg.large_image_url}
                      alt={element.manga.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105 saturate-[0.85] group-hover:saturate-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-[11px] text-gray-500 group-hover:text-gray-300 font-medium line-clamp-2 leading-snug transition-colors duration-200">
                  {element.manga.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
