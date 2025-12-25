"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Loader from "./loader/Loader";

export default function MangaRecommendations({ mangaId, length }) {
  const [recommendations, setRecommendations] = useState({
    error: false,
    loading: false,
    data: [],
  });

  useEffect(() => {
    if (!mangaId) return;

    async function getRecommendations() {
      setRecommendations({
        error: false,
        loading: true,
        data: [],
      });
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/manga/${mangaId}/recommendations`
        );
        if (!res.ok) {
          throw new Error("An error has occurred");
        }
        const result = await res.json();
        setRecommendations({
          error: false,
          loading: false,
          data: result.data || [],
        });
      } catch (error) {
        console.error(error.message);
        setRecommendations({
          error: true,
          loading: false,
          data: [],
        });
      }
    }

    getRecommendations();
  }, [mangaId]);

  const handleRetry = () => {
    if (!mangaId) return;

    setRecommendations({
      error: false,
      loading: true,
      data: [],
    });

    async function retry() {
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/manga/${mangaId}/recommendations`
        );
        if (!res.ok) {
          throw new Error("An error has occurred");
        }
        const result = await res.json();
        setRecommendations({
          error: false,
          loading: false,
          data: result.data || [],
        });
      } catch (error) {
        console.error(error.message);
        setRecommendations({
          error: true,
          loading: false,
          data: [],
        });
      }
    }

    retry();
  };

  if (recommendations.loading) {
    return <Loader />;
  }

  if (recommendations.error) {
    return (
      <div className=" flex flex-col gap-2 items-center mt-5">
        <p className="text-red-400 text-base italic">
          Failed to load recommendations.
        </p>
        <button
          className=" border border-transparent rounded-xl px-4 py-2 text-white bg-blue-900 cursor-pointer"
          onClick={handleRetry}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!recommendations.data || recommendations.data.length === 0) {
    return (
      <section className=" flex flex-col items-center mt-10 text-white">
        <p>No recommendations found</p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-wrap gap-5">
        {recommendations.data
          .slice(0, length === 0 ? recommendations.data.length : length)
          .map((recommendation) => {
            if (
              !recommendation?.entry?.mal_id ||
              !recommendation?.entry?.images?.jpg?.large_image_url
            ) {
              return null;
            }

            return (
              <Link
                href={`/manga/${recommendation.entry.mal_id}`}
                key={recommendation.entry.mal_id}
              >
                <div className="relative flex flex-col gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity duration-200">
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                    <div
                      className="overflow-hidden rounded-lg border border-gray-700"
                      style={{
                        width: "144px", // 9 * 16
                        height: "208px", // 13 * 16
                        minWidth: "144px",
                        minHeight: "208px",
                      }}
                    >
                      <Image
                        src={recommendation.entry.images.jpg.large_image_url}
                        width={144}
                        height={208}
                        alt={recommendation.entry.title || "Manga cover"}
                        className="object-cover bg-gray-900 w-full h-full aspect-[9/13] hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h2
                      className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2"
                      style={{
                        width: "144px",
                        minWidth: "144px",
                        maxWidth: "144px",
                      }}
                    >
                      {recommendation.entry.title}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </section>
  );
}
