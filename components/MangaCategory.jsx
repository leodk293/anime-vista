"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { nanoid } from "nanoid";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Allerta } from "next/font/google";

const PAGE_SIZE = 20;

const allerta = Allerta({
  subsets: ["latin"],
  weight: "400",
});

export default function MangaCategory({ category, api }) {
  const [manga, setManga] = useState({
    error: false,
    loading: false,
    data: [],
  });

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef(null);

  async function getManga() {
    try {
      setManga((prev) => ({ ...prev, loading: true, error: false }));
      const res = await fetch(api);
      if (!res.ok) throw new Error("An error has occurred");
      const result = await res.json();
      setManga({ error: false, loading: false, data: result.data });
      setVisibleCount(PAGE_SIZE);
    } catch (error) {
      setManga({ error: true, loading: false, data: [] });
    }
  }

  useEffect(() => {
    getManga();
  }, []);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !manga.loading) {
        setVisibleCount((prev) => {
          if (prev >= manga.data.length) return prev;
          return prev + PAGE_SIZE;
        });
      }
    },
    [manga.loading, manga.data.length],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (manga.error) {
    return (
      <div className="flex flex-col gap-3 items-center text-white w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <button
          className="border border-transparent font-medium rounded-xl text-white bg-blue-900 px-4 py-2 cursor-pointer"
          onClick={getManga}
        >
          Try again
        </button>
      </div>
    );
  }

  if (manga.loading) {
    return (
      <div className="text-white w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-48 rounded bg-gray-300/30" />
          <span className="w-[150px] h-3 rounded-full bg-gray-700" />
        </div>
        <div className="w-full mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5 sm:gap-2">
              <Skeleton className="rounded-lg w-full aspect-[9/13] bg-gray-300/30" />
              <Skeleton className="h-4 w-3/4 rounded bg-gray-300/30" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (manga.data && manga.data.length > 0) {
    const filtered = manga.data.filter(
      (m, index, self) =>
        index === self.findIndex((a) => a.mal_id === m.mal_id),
    );
    const visibleManga = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;

    return (
      <div className="text-white w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col gap-3">
          <h1 className={`${allerta.className} text-3xl font-bold`}>
            {category}
          </h1>
          <span className="w-[150px] h-3 rounded-full bg-gray-700" />
        </div>

        <div className="w-full mt-10 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {visibleManga.map((m) => (
            <MangaCategoryCard key={nanoid(10)} manga={m} />
          ))}
        </div>

        {hasMore && (
          <div
            ref={loaderRef}
            className="w-full mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5"
          >
            {Array.from({
              length: Math.min(PAGE_SIZE, filtered.length - visibleCount),
            }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5 sm:gap-2">
                <Skeleton className="rounded-lg w-full aspect-[9/13] bg-gray-300/30" />
                <Skeleton className="h-4 w-3/4 rounded bg-gray-300/30" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

function MangaCategoryCard({ manga }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      href={`/manga/${manga.mal_id}`}
      className="flex flex-col gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity duration-200"
    >
      <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
        <div className="overflow-hidden rounded-lg border border-gray-700 w-full aspect-[9/13] relative bg-gray-900">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full rounded-lg bg-gray-300/30" />
          )}
          <Image
            src={manga.images.jpg.large_image_url}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            alt={manga.title}
            className={`object-cover hover:scale-105 transition-all duration-300`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        {!imageLoaded ? (
          <Skeleton className="h-4 w-3/4 rounded bg-gray-300/30" />
        ) : (
          <h2 className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2">
            {manga.title}
          </h2>
        )}
      </div>
    </Link>
  );
}
