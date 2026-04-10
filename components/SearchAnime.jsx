"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import animeList from "../utils/animeArray";
import { nanoid } from "nanoid";
import { Search } from "lucide-react";

export default function SearchAnime() {
  const [animeName, setAnimeName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
        isFocused
          ? "border-blue-500/60 bg-white/10 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
          : "border-white/15 bg-white/5"
      }`}
    >
      <Search
        size={15}
        strokeWidth={1.8}
        className={`shrink-0 transition-colors duration-200 ${
          isFocused ? "text-blue-400" : "text-white/40"
        }`}
      />
      <input
        className="w-36 md:w-44 bg-transparent text-sm text-white/90 placeholder-white/30 outline-none font-medium"
        placeholder="Search anime..."
        type="text"
        onChange={(e) => setAnimeName(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={animeName}
        list="anime-list"
        required
      />
      <datalist id="anime-list">
        {animeList.map((anime) => (
          <option key={nanoid(10)} value={anime} />
        ))}
      </datalist>
      <button
        type="submit"
        className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/80 hover:bg-blue-500 text-white transition-colors duration-200"
      >
        Go
      </button>
    </form>
  );
}
