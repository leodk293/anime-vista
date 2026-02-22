"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeBox({
  animeId,
  animeImage,
  animeName,
  year,
  season,
  genres,
}) {
  const { data: session, status } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const success = () => {
    toast.success("Added to Watchlist", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const alreadyAdded = () => {
    toast("Already added to Watchlist", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const loginAlert = () => {
    toast.error("Login first to add anime to your watchlist.", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleAddToWatchList = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "unauthenticated") {
      loginAlert();
      return;
    }

    if (status === "loading") {
      toast.info("Please wait for authentication...");
      return;
    }

    if (!animeId || !animeName || !animeImage) {
      toast.error("Missing anime information");
      return;
    }

    if (
      year === undefined ||
      season === undefined ||
      !genres ||
      !Array.isArray(genres)
    ) {
      toast.error("Missing required anime details (year, season, or genres)");
      return;
    }

    if (!session?.user?.id || !session?.user?.name) {
      toast.error("User session is incomplete. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/watch-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animeId: String(animeId),
          animeTitle: String(animeName),
          animePoster: String(animeImage),
          userId: String(session.user.id),
          userName: String(session.user.name),
          year: Number(year),
          season: String(season),
          genres: Array.isArray(genres)
            ? genres.map((g) =>
                typeof g === "object" && g !== null
                  ? g.name || String(g)
                  : String(g),
              )
            : [
                typeof genres === "object" && genres !== null
                  ? genres.name || String(genres)
                  : String(genres),
              ],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 409) {
          alreadyAdded();
        } else if (res.status === 400) {
          toast.error(`Invalid request: ${errorData.error}`);
        } else if (res.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Failed to add anime to Watchlist");
        }
        return;
      }

      success();
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Network error. Please check your connection.");
      } else if (error.name === "SyntaxError") {
        toast.error("Invalid server response. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/anime/${animeId}`}
        className="flex flex-col gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity duration-200"
      >
        <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
          <div className="overflow-hidden rounded-lg border border-gray-700 w-full aspect-[9/13] relative bg-gray-900">
            {/* Skeleton shown while image is loading */}
            {!imageLoaded && (
              <Skeleton className="absolute bg-gray-300/30 inset-0 w-full h-full rounded-lg" />
            )}
            <Image
              src={animeImage}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              alt={animeName}
              className={`object-cover hover:scale-105 transition-all duration-300 `}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          {/* Skeleton for title while image loads */}
          {!imageLoaded ? (
            <Skeleton className="h-4 w-3/4 bg-gray-300/30 rounded" />
          ) : (
            <h2 className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2">
              {animeName}
            </h2>
          )}
        </div>
      </Link>

      {isHovered && (
        <div className="absolute top-2 right-2 z-10">
          <button
            title="Add to Watchlist"
            onClick={handleAddToWatchList}
            disabled={isLoading}
            className={`bg-black/80 border border-gray-600 text-white px-3 py-1.5 rounded-md text-[16px] font-medium hover:translate-x-[-5px] duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isLoading ? "Adding..." : "Add to Watchlist"}
          </button>
        </div>
      )}
    </div>
  );
}
