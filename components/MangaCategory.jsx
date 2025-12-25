"use client";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "./loader/Loader";
import { nanoid } from "nanoid";
import Image from "next/image";

export default function MangaCategory({ category, api }) {
  const [manga, setManga] = useState({
    error: false,
    loading: false,
    data: [],
  });

  const router = useRouter();

  async function getManga() {
    setManga((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const res = await fetch(api);
      if (!res.ok) {
        throw new error("An error has occurred");
      }
      const result = await res.json();
      setManga({
        error: false,
        loading: false,
        data: result.data,
      });
    } catch (error) {
      setManga({
        error: true,
        loading: false,
        data: [],
      });
    }
  }

  useEffect(() => {
    getManga();
  }, []);

  if (manga.error) {
    return (
      <div className=" flex flex-col gap-3 items-center text-white w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className=" text-xl font-semibold">Something went wrong</h1>
        <button
          className=" border border-transparent font-medium rounded-xl text-white bg-blue-900 px-4 py-2 cursor-pointer"
          onClick={getManga}
        >
          Try again
        </button>
      </div>
    );
  }

  if (manga.loading) {
    return <Loader />;
  }

  if (manga.data && manga.data.length > 0) {
    return (
      <div className=" text-white w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className=" flex flex-col gap-3">
          <h1 className=" text-3xl font-bold">{category}</h1>
          <span className={` w-[150px] h-3 rounded-full bg-indigo-900`} />
        </div>

        <div className="w-full mt-5 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {manga.data
            .filter(
              (manga, index, self) =>
                index === self.findIndex((a) => a.mal_id === manga.mal_id)
            )
            .map((manga) => (
              <div key={nanoid(10)}>
                <Link
                  key={nanoid(10)}
                  href={`/manga/${manga.mal_id}`}
                  className="flex flex-col gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity duration-200"
                >
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                    <div className="overflow-hidden rounded-lg border border-gray-700">
                      <Image
                        src={manga.images.jpg.large_image_url}
                        width={180}
                        height={200}
                        alt={manga.title}
                        className="object-cover bg-gray-900 w-full aspect-[9/13] hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h2 className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2">
                      {manga.title}
                    </h2>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
