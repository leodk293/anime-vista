"use client";
import React from "react";
import { use } from "react";
import MangaRecommendations from "../../../../../components/MangaRecommendations";

export default function Recommendations({params}) {
  const resolvedParams = use(params);
  const mangaId = resolvedParams.mangaId;

  return (
    <div className=" flex flex-col gap-5">
      <div className=" flex flex-col gap-2">
        <h1 className=" text-2xl font-bold text-white">You may like</h1>
        <span className=" w-[100px] p-1 rounded-full bg-blue-800"/>
     </div>
      <MangaRecommendations mangaId={mangaId} length={0} />
    </div>
  );
}
