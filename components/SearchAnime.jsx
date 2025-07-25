"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={handleSubmit} className=" flex flex-row" action="">
      <input
        className=" text-gray-100 font-medium px-4 py-2 self-center border border-gray-500 border-r-transparent rounded-tl-lg outline-none rounded-bl-lg text-lg"
        placeholder="Search for an anime..."
        type="text"
        onChange={(e) => setAnimeName(e.target.value)}
        value={animeName}
        required
      />
      <button className=" cursor-pointer p-2 border border-gray-500 bg-blue-950 self-center rounded-tr-lg rounded-br-lg text-lg">
        <Search size={28} color="#ffffff" strokeWidth={1.75} />
      </button>
    </form>
  );
}
