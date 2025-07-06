"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import Image from "next/image";
import Loader from "../../../../../components/loader/Loader";

export default function CharacterPage({ params }) {
  const resolvedParams = use(params);
  const { animeId, characterId } = resolvedParams;

  const [animePoster, setAnimePoster] = useState(null);

  async function getAnimePoster() {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch anime data");
      }
      const result = await res.json();
      setAnimePoster(result.data.images.jpg.large_image_url);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getAnimePoster();
  }, [animeId]);

  if (!animeId || !characterId) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-xl text-red-500">Invalid ID provided.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {animePoster && (
        <div className="fixed inset-0 -z-10 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900" />
          <Image
            src={animePoster}
            alt="Background"
            fill
            className="object-cover blur-sm"
            priority
          />
        </div>
      )}

      {/* Main Content */}
      <div className="relative pt-20 pb-12"></div>
    </div>
  );
}
