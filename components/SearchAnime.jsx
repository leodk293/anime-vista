"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchAnime() {
  const [animeName, setAnimeName] = useState("");
  const router = useRouter();
  const [animeList, setAnimeList] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (animeName.trim()) {
      router.push(`/search-anime?anime=${encodeURIComponent(animeName)}`);
      setAnimeName("");
    }
  };

  async function getAnimeList() {
    try {
      const response = await fetch(
        "https://anime-vista-api.vercel.app/api/anime-vista-list"
      );
      if (!response.ok) {
        throw new Error("An error has occurred");
      }
      const result = await response.json();
      setAnimeList(result.animeList);
    } catch (error) {
      console.error("Error fetching anime list:", error);
      setAnimeList([]);
    }
  }

  useEffect(() => {
    getAnimeList();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className=" border border-gray-500 rounded-lg flex flex-row p-1"
    >
      <input
        className=" text-gray-100 font-medium px-4 py-2 self-center bg-transparent outline-0 "
        placeholder="Search for an anime..."
        type="text"
        onChange={(e) => setAnimeName(e.target.value)}
        value={animeName}
        list="anime-list"
        required
      />

      <datalist id="anime-list">
        {animeList.map((anime) => (
          <option key={anime.animeId} value={anime.animeName} />
        ))}
      </datalist>
      <button className=" cursor-pointer text-white px-2 py-1 border border-transparent bg-white/5 rounded-lg self-center text-lg">
        Search
      </button>
    </form>
  );
}
