"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import animeList from "../utils/animeArray";
import { nanoid } from "nanoid";

export default function SearchAnime() {
  const [animeName, setAnimeName] = useState("");
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (animeName.trim()) {
      router.push(`/search-anime?anime=${encodeURIComponent(animeName)}`);
      setAnimeName("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" border border-gray-500 rounded-lg flex flex-row p-1"
    >
      <input
        className=" text-gray-100 font-medium px-4 py-1 self-center bg-transparent outline-0 "
        placeholder="Search for an anime..."
        type="text"
        onChange={(e) => setAnimeName(e.target.value)}
        value={animeName}
        list="anime-list"
        required
      />

      <datalist id="anime-list">
        {animeList.map((anime) => (
          <option key={nanoid(10)} value={anime} />
        ))}
      </datalist>
      <button className=" cursor-pointer text-white font-medium px-2 py-1 border border-gray-700 bg-gray-800 rounded-sm self-center">
        Search
      </button>
    </form>
  );
}
