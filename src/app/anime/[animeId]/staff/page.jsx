"use client";
import React from "react";
import { use } from "react";
import AnimeStaff from "../../../../../components/AnimeStaff";

export default function StaffPage({ params }) {
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;
  return (
    <div className=" flex flex-col gap-10 text-white">
      <div className=" flex flex-col gap-2">
        <h1 className="text-xl font-bold">Anime Staff</h1>
        <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
      </div>
      <AnimeStaff animeId={animeId} length={0} />
    </div>
  );
}
