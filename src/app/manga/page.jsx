"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Loader from "../../../components/loader/Loader";

export default function MangaPage() {
  const [mangaGenres, setMangaGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mangaList, setMangaList] = useState({
    error: false,
    loading: false,
    data: [],
  });

  const status = [
    {
      name:"Finished",
      value:"Finished"
    },
    {
      name:"Still ongoing",
      value:"Publishing"
    },
    {
      name:"On pause",
      value:"On Hiatus"
    }
  ]

  async function getMangaGenres() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.jikan.moe/v4/genres/manga`);

      if (!response.ok) {
        throw new Error(`Failed to fetch genres (${response.status})`);
      }

      const result = await response.json();

      if (result.data && Array.isArray(result.data)) {
        setMangaGenres(result.data);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching manga genres:", error);
      setError(error.message || "Failed to load genres. Please try again.");
      setMangaGenres([]);
    } finally {
      setLoading(false);
    }
  }

  async function getMangaList() {
    setMangaList({
      error: false,
      loading: true,
      data: [],
    });

    try {
      const params = new URLSearchParams();

      if (searchTerm.trim()) {
        params.append("name", searchTerm.trim());
      }

      if (selectedGenre) {
        params.append("genres", selectedGenre);
      }

      if (selectedStatus) {
        params.append("status", selectedStatus);
      }

      const response = await fetch(
        `https://manga-db-management.vercel.app/api/manga-list?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("An error has occurred");
      }
      const result = await response.json();
      setMangaList({
        error: false,
        loading: false,
        data: [...result.mangaList].reverse(),
      });
    } catch (error) {
      console.error(error.message);
      setMangaList({
        error: true,
        loading: false,
        data: [],
      });
    }
  }

  useEffect(() => {
    getMangaGenres();
  }, []);

  useEffect(() => {
    getMangaList();
  }, [searchTerm, selectedGenre, selectedStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({ searchTerm, selectedGenre, selectedStatus });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSelectedStatus("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="font-bold text-white text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">
          Explore Manga
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Discover your next favorite manga
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-5 mb-6">
        <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-stretch">
          <Link className="flex-1 md:w-[30%]" href={`/popular-manga`}>
            <button className="group transition-all duration-200 w-full h-full cursor-pointer relative border border-blue-500/70 bg-gradient-to-tr from-blue-700/20 to-blue-500/10 hover:from-blue-600/60 hover:to-blue-400/20 px-8 py-6 rounded-2xl text-xl font-semibold text-white shadow-xl hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/40 flex flex-col items-center justify-center">
              <span className="text-3xl mb-2 animate-bounce group-hover:scale-110 transition-transform duration-200">
                💖
              </span>
              <span className="font-bold tracking-wide">Most Popular</span>
              <span className="mt-1 text-blue-200/70 text-xs">
                See trending manga
              </span>
            </button>
          </Link>

          <Link className="flex-1 md:w-[30%]" href={`/top-rated-manga`}>
            <button className="group transition-all duration-200 w-full h-full cursor-pointer relative border border-yellow-400/70 bg-gradient-to-tr from-yellow-700/20 to-yellow-500/10 hover:from-yellow-600/50 hover:to-yellow-400/20 px-8 py-6 rounded-2xl text-xl font-semibold text-white shadow-xl hover:text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300/40 flex flex-col items-center justify-center">
              <span className="text-3xl mb-2 animate-pulse group-hover:scale-110 transition-transform duration-200">
                ⭐
              </span>
              <span className="font-bold tracking-wide">Top Rated</span>
              <span className="mt-1 text-yellow-200/80 text-xs">
                Highest rated manga
              </span>
            </button>
          </Link>

          <Link className="flex-1 md:w-[30%]" href={`/ongoing-manga`}>
            <button className="group transition-all duration-200 w-full h-full cursor-pointer relative border border-green-300/70 bg-gradient-to-tr from-green-700/20 to-green-500/10 hover:from-green-600/60 hover:to-green-400/20 px-8 py-6 rounded-2xl text-xl font-semibold text-white shadow-xl hover:text-green-200 focus:outline-none focus:ring-2 focus:ring-green-400/40 flex flex-col items-center justify-center">
              <span className="text-3xl mb-2 group-hover:rotate-6 transition-transform duration-200">
                📖
              </span>
              <span className="font-bold tracking-wide">Still ongoing</span>
              <span className="mt-1 text-green-200/80 text-xs">
                Ongoing releases
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4 mt-10 sm:space-y-6">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search manga by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-gray-300/10 rounded-xl sm:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 text-sm font-medium mb-1">
                Error Loading Genres
              </p>
              <p className="text-red-300/80 text-xs sm:text-sm">{error}</p>
              <button
                type="button"
                onClick={getMangaGenres}
                className="mt-3 text-xs sm:text-sm text-red-300 hover:text-red-200 underline transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Genre Select */}
          <div className="space-y-2">
            <label className="block text-white/80 text-sm font-medium pl-1">
              Genres
            </label>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                disabled={loading || error}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-gray-300/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <option value="" className="bg-gray-900">
                  {loading ? "Loading genres..." : "All Genres"}
                </option>
                {mangaGenres.map((genre) => (
                  <option
                    key={genre.mal_id || genre.name}
                    value={genre.name}
                    className="bg-gray-900"
                  >
                    {genre.name}
                  </option>
                ))}
              </select>
              {loading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
              )}
            </div>
          </div>

          {/* Status Select */}
          <div className="space-y-2">
            <label className="block text-white/80 text-sm font-medium pl-1">
              Status
            </label>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-gray-300/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              >
                <option value="" className="bg-gray-900">
                  All Status
                </option>
                {status.map((s) => (
                  <option key={s.value} value={s.value} className="bg-gray-900">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>

      {loading && !error && (
        <div className="mt-8 text-center">
          <Loader2 className="h-8 w-8 text-white/60 animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading genres...</p>
        </div>
      )}

      {(searchTerm || selectedGenre || selectedStatus) && (
        <div className="mt-6 sm:mt-8 p-4 bg-white/5 rounded-xl border border-gray-300/10">
          <p className="text-white/60 text-xs sm:text-sm font-medium mb-2">
            Active Filters:
          </p>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">
                Search: {searchTerm}
              </span>
            )}
            {selectedGenre && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">
                Genre: {selectedGenre}
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">
                Status: {selectedStatus}
              </span>
            )}

            <button
              onClick={handleReset}
              className=" text-white cursor-pointer border border-transparent px-4 py-1 rounded-full bg-white/10"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {mangaList.error ? (
        <p className=" text-center text-xl mt-10 text-red-700">
          Something went wrong, try again...
        </p>
      ) : mangaList.loading ? (
        <Loader />
      ) : mangaList.data && mangaList.data.length > 0 ? (
        <div className="w-full mt-10 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {mangaList.data.map((manga) => (
            <Link
              href={`/manga/${encodeURIComponent(manga.mangaId)}`}
              key={manga.mangaId}
              className="flex flex-col gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity duration-200"
            >
              <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                <div className="overflow-hidden rounded-lg border border-gray-700">
                  <Image
                    src={manga.mangaPoster}
                    width={180}
                    height={200}
                    alt={manga.mangaName}
                    className="object-cover bg-gray-900 w-full aspect-[9/13] hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h2 className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2">
                  {manga.mangaName}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-400 text-sm">
          No manga found for the current filter.
        </div>
      )}
    <button
      className="fixed cursor-pointer bottom-6 left-10 z-50 bg-white/5 text-white rounded-full shadow-lg p-3 transition-all duration-200 focus:outline-none focus:ring-2"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="Back to Top"
      aria-label="Back to Top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
    </div>
  );
}
