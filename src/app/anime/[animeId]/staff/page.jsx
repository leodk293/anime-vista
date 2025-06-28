"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Image from "next/image";
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
      <AnimeStaff animeId={animeId} slice={0} />
    </div>
  );
}
