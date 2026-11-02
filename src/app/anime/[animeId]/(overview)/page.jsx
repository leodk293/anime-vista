"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";

const PAGE_SIZE = 10;

export default function AnimePage({ params }) {
  const { animeId } = use(params);

  const [animeCharacters, setAnimeCharacters] = useState({
    data: [],
    loading: true,
    loadingMore: false,
    hasMore: false,
    error: false,
    errorMessage: "",
  });

  const [relatedAnime, setRelatedAnime] = useState({
    data: { related_anime: [], recommendations: [] },
    loading: true,
    error: false,
    errorMessage: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function getAnimeData() {
      try {
        const response = await fetch(
          `/api/anime/${animeId}?offset=0&limit=${PAGE_SIZE}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch anime data: ${response.status}`);
        }
        const data = await response.json();

        setAnimeCharacters({
          data: data.characters ?? [],
          loading: false,
          loadingMore: false,
          hasMore: data.hasMoreCharacters ?? false,
          error: Boolean(data.errors?.characters),
          errorMessage: data.errors?.characters
            ? "Failed to load characters. Please try again later."
            : "",
        });

        setRelatedAnime({
          data: {
            related_anime: data.related_anime ?? [],
            recommendations: data.recommendations ?? [],
          },
          loading: false,
          error: Boolean(data.errors?.details),
          errorMessage: data.errors?.details
            ? "Failed to load recommendations. Please try again later."
            : "",
        });
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error.message);
        setAnimeCharacters((prev) => ({
          ...prev,
          loading: false,
          error: true,
          errorMessage: "Failed to load characters. Please try again later.",
        }));
        setRelatedAnime((prev) => ({
          ...prev,
          loading: false,
          error: true,
          errorMessage:
            "Failed to load recommendations. Please try again later.",
        }));
      }
    }

    getAnimeData();
    return () => controller.abort();
  }, [animeId]);

  async function loadMoreCharacters() {
    setAnimeCharacters((prev) => ({ ...prev, loadingMore: true }));
    try {
      const response = await fetch(
        `/api/anime/${animeId}?offset=${animeCharacters.data.length}&limit=${PAGE_SIZE}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch characters: ${response.status}`);
      }
      const data = await response.json();
      setAnimeCharacters((prev) => ({
        ...prev,
        data: [...prev.data, ...(data.characters ?? [])],
        hasMore: data.hasMoreCharacters ?? false,
        loadingMore: false,
      }));
    } catch (error) {
      console.error(error.message);
      setAnimeCharacters((prev) => ({ ...prev, loadingMore: false }));
    }
  }

  return (
    <div className="min-h-screen text-zinc-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Characters</h1>

      {animeCharacters.loading && (
        <p className="text-zinc-400">Loading characters...</p>
      )}
      {animeCharacters.error && (
        <p className="text-red-400">{animeCharacters.errorMessage}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {animeCharacters.data.map(({ node, role }) => {
          const name = `${node.first_name} ${node.last_name}`.trim();
          return (
            <div
              key={node.id}
              className="flex flex-col gap-2 bg-zinc-900/10 backdrop-blur-sm border border-white/10 rounded-lg p-2"
            >
              {node.main_picture?.medium && (
                <Image
                  src={node.main_picture.medium}
                  alt={name}
                  width={225}
                  height={320}
                  className="w-full h-auto object-cover rounded-md"
                />
              )}
              <h2 className="text-sm font-semibold">{name}</h2>
              <p className="text-xs text-zinc-400">{role}</p>
              <p className="text-xs text-zinc-500">
                ♥ {(node.num_favorites ?? 0).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {animeCharacters.hasMore && (
        <button
          onClick={loadMoreCharacters}
          disabled={animeCharacters.loadingMore}
          className="mt-6 px-4 py-2 rounded-md bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/10 text-sm transition-colors disabled:opacity-50"
        >
          {animeCharacters.loadingMore ? "Loading..." : "Load more"}
        </button>
      )}

      <h1 className="text-2xl font-bold mt-10 mb-4">Recommendations</h1>
      {relatedAnime.loading && (
        <p className="text-zinc-400">Loading recommendations...</p>
      )}
      {relatedAnime.error && (
        <p className="text-red-400">{relatedAnime.errorMessage}</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {relatedAnime.data.recommendations.slice(0, 5).map(({ node }) => (
          <div
            key={node.id}
            className="bg-zinc-900/10 backdrop-blur-sm border border-white/10 rounded-lg p-2"
          >
            <Link href={`/anime/${node.id}`}>
              <Image
                src={node.main_picture?.medium ?? "/placeholder.png"}
                alt={node.title}
                width={225}
                height={320}
                className="w-full h-auto object-cover rounded-md"
              />
            </Link>
            <h2 className="text-sm font-semibold mt-2">{node.title}</h2>
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold mt-10 mb-4">Related</h1>
      {relatedAnime.error && (
        <p className="text-red-400">{relatedAnime.errorMessage}</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {relatedAnime.data.related_anime.map(
          ({ node, relation_type_formatted }) => (
            <div
              key={node.id}
              className="bg-zinc-900/10 backdrop-blur-sm border border-white/10 rounded-lg p-2"
            >
              <Link href={`/anime/${node.id}`}>
                <Image
                  src={node.main_picture?.medium ?? "/placeholder.png"}
                  alt={node.title}
                  width={225}
                  height={320}
                  className="w-full h-auto object-cover rounded-md"
                />
              </Link>
              <h2 className="text-sm font-semibold mt-2">{node.title}</h2>
              {relation_type_formatted && (
                <p className="text-xs text-zinc-400">
                  {relation_type_formatted}
                </p>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}