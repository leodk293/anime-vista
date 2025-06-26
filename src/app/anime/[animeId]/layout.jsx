import React from "react";
import fetchAnimeData from "../../../../utils/fetchAnimeData";
import Image from "next/image";
import Link from "next/link";

export default async function layout({ children, params }) {
  const { animeId } = params;
  const animeData = await fetchAnimeData(animeId);

  if (!animeData) {
    return (
      <h1 className=" text-center text-base text-red-700 h-full">
        An error has occurred, Try again
      </h1>
    );
  }

  return (
    <div className="mt-[4rem] flex flex-col max-w-5xl gap-10 items-center mx-auto">
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="flex-shrink-0 flex justify-start">
          <Image
            src={animeData.data.images.jpg.large_image_url}
            alt={
              animeData.data.title_english
                ? animeData.data.title_english
                : animeData.data.title
            }
            className="object-cover border border-gray-800 rounded-sm shadow-lg"
            width={230}
            height={130}
          />
        </div>
        <div className="flex flex-col justify-center text-left w-full">
          <h1 className="text-3xl font-semibold text-white mb-4">
            {animeData.data.title_english
              ? animeData.data.title_english
              : animeData.data.title}
          </h1>
          <p className="text-[15px] leading-6 text-blue-200 mb-4">
            {animeData.data.synopsis
              ? animeData.data.synopsis
              : "No Synopsis found"}
          </p>

          <div className="flex flex-wrap gap-8 text-blue-200 text-lg font-medium border-b border-blue-900 pb-2">
            <Link href={`/anime/${animeId}`}>Overview</Link>
            <Link href={`/anime/${animeId}/watch`}>Watch</Link>
            <Link href={`/anime/${animeId}/characters`}>Characters</Link>
            <Link href={`/anime/${animeId}/staff`}>Staff</Link>
            <Link href={`/anime/${animeId}/stats`}>Stats</Link>
            <Link href={`/anime/${animeId}/social`}>Social</Link>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-wrap gap-8 w-full text-blue-200 text-lg font-medium border-b border-blue-900 pb-2">
        <Link href="/">Overview</Link>
        <Link href="/watch">Watch</Link>
        <Link href="/characters">Characters</Link>
        <Link href="/staff">Staff</Link>
        <Link href="/stats">Stats</Link>
        <Link href="/social">Social</Link>
      </div> */}

      <div className="w-full flex flex-col gap-5 px-4 sm:px-6 md:px-8 lg:px-10">{children}</div>
    </div>
  );
}
