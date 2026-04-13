"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import letters from "../../../../utils/letters";
import Link from "next/link";
import { nanoid } from "nanoid";
import AnimeBox from "../../../../components/AnimeBox";

export default function Alphabetical({ params }) {
  const resolvedParams = use(params);
  const starter_letter = resolvedParams.letter;
  const [animeList, setAnimeList] = useState({
    error: false,
    loading: false,
    data: [],
  });

  const [animeName, setAnimeName] = useState("");

  const filteredData = animeName.trim()
    ? animeList.data.filter((a) =>
        a.animeName?.toLowerCase().includes(animeName.trim().toLowerCase()),
      )
    : animeList.data;

  async function fetchFilteredAnimeList() {
    setAnimeList({ error: false, loading: true, data: [] });
    try {
      const response = await fetch(
        `https://anime-vista-api.vercel.app/api/alphabetical?letter=${starter_letter}`,
      );
      if (!response.ok) throw new Error("An error has occurred");
      const result = await response.json();
      setAnimeList({ error: false, loading: false, data: result });
    } catch (error) {
      console.error(error.message);
      setAnimeList({ error: true, loading: false, data: [] });
    }
  }

  useEffect(() => {
    fetchFilteredAnimeList();
    // Réinitialiser la recherche lors d'un changement de lettre
    setAnimeName("");
  }, [starter_letter]);

  return (
    <div className="min-h-screen text-white">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 overflow-hidden">
        {/* Lettre décorative en filigrane */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none fixed top-0 right-0 text-[20rem] sm:text-[28rem] font-black leading-none text-white/[0.025] z-0"
        >
          {starter_letter}
        </div>

        <header className="relative z-10 mb-6 flex items-end gap-4">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-blue-700 font-mono mb-1">
              Anime Index
            </p>
            <h1 className="text-3xl font-black leading-none tracking-tight">
              BROWSE
              <span className="text-blue-700"> {starter_letter}</span>
            </h1>
          </div>
          {!animeList.loading &&
            !animeList.error &&
            animeList.data.length > 0 && (
              <span className="pb-2 text-[11px] font-mono tracking-widest text-white/40 uppercase">
                {/* Afficher le nombre de résultats filtrés si une recherche est active */}
                {animeName.trim()
                  ? `${filteredData.length} / ${animeList.data.length} titles`
                  : `${animeList.data.length} titles`}
              </span>
            )}
        </header>

        <div className="relative z-10 h-px w-full mb-8 bg-gradient-to-r from-blue-600 via-violet-500 to-transparent" />

        <nav
          aria-label="Browse by letter"
          className="relative z-10 flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-1 mb-10 pb-2 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {letters.map((letter) => (
            <Link
              key={letter}
              href={`/alphabetical/${letter}`}
              className={`
            inline-flex items-center justify-center min-w-[2.2rem] px-2 py-1.5
            text-base font-black tracking-wide rounded-sm border transition-all duration-150
            ${
              starter_letter === letter
                ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_16px_rgba(225,29,72,0.5)]"
                : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white"
            }
                `}
            >
              {letter}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full mb-5 border-white/15 bg-white/5 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 md:w-[25%] focus-within:border-blue-600/50 focus-within:bg-white/[0.07]"
        >
          <input
            onInput={(event) => setAnimeName(event.target.value)}
            value={animeName}
            className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/30 outline-none font-medium"
            type="text"
            placeholder="Search an anime..."
          />
          {/* Bouton pour effacer la recherche */}
          {animeName && (
            <button
              type="button"
              onClick={() => setAnimeName("")}
              className="shrink-0 text-white/30 hover:text-white/70 transition-colors text-sm leading-none"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <span className="shrink-0 text-xl font-semibold">🔍</span>
        </form>

        {/* État d'erreur */}
        {animeList.error && (
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
            <span className="text-[8rem] font-black text-blue-700/25 leading-none">
              ERR
            </span>
            <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/40">
              Failed to load results
            </p>
            <button
              onClick={fetchFilteredAnimeList}
              className="mt-2 px-6 py-2 text-[11px] font-mono tracking-widest uppercase text-blue-700 border border-rose-500 rounded-sm hover:bg-rose-600 hover:text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]"
            >
              Retry
            </button>
          </div>
        )}

        {animeList.loading && (
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-full aspect-[9/13] rounded-sm bg-white/[0.06] animate-pulse" />
                <div className="h-3 w-3/4 rounded-sm bg-white/[0.06] animate-pulse" />
                <div className="h-2.5 w-1/2 rounded-sm bg-white/[0.04] animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {!animeList.loading && !animeList.error && (
          <>
            {filteredData.length === 0 && animeName.trim() ? (
              
              <div className="relative z-10 flex flex-col items-center justify-center min-h-[30vh] gap-3 text-center">
                <span className="text-[5rem] font-black text-white/[0.06] leading-none">
                  ?
                </span>
                <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/30">
                  No results for &ldquo;{animeName}&rdquo;
                </p>
                <button
                  onClick={() => setAnimeName("")}
                  className="mt-1 text-[10px] font-mono tracking-widest uppercase text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {filteredData.map((a) => (
                  <div key={nanoid(10)}>
                    <AnimeBox
                      animeId={a.animeId}
                      animeImage={a.animeImage}
                      animeName={a.animeName}
                      year={a.year}
                      season={a.season}
                      genres={
                        Array.isArray(a.genres)
                          ? a.genres.map((g) =>
                              typeof g === "object" && g !== null ? g.name : g,
                            )
                          : []
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
