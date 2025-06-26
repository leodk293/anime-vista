import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AnimeBox({ animeId, animeImage, animeName }) {
  return (
    <Link
      key={animeId}
      href={`/anime/${animeId}`}
      className="flex flex-col gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity duration-200"
    >
      <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
        <Image
          src={animeImage}
          width={180}
          height={200}
          alt={animeName}
          className="rounded-lg border border-gray-700 object-cover w-full aspect-[9/13]"
        />
        <h2 className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2">
          {animeName}
        </h2>
      </div>
    </Link>
  );
}
