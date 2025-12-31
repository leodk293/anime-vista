"use client";
import React from "react";
import AnimeCharacters from "../../../../../components/AnimeCharacters";
import { use } from "react";

export default function CharactersPage({ params }) {
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;

  return (
    <div className=" text-white flex flex-col gap-10">
      <div className=" flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Characters</h1>
        <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
      </div>

      <AnimeCharacters animeId={animeId} length={0} />
    </div>
  );
}
