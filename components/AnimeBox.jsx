"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export default function AnimeBox({ animeId, animeImage, animeName }) {
  const { data: session, status } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    if (!session?.user?.id || !session?.user?.name) {
      toast.error("User session is incomplete. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending request with data:", {
        animeId,
        animeTitle: animeName,
        animePoster: animeImage,
        userId: session.user.id,
        userName: session.user.name,
      });

      const res = await fetch("/api/watch-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animeId: String(animeId),
          animeTitle: String(animeName),
          animePoster: String(animeImage),
          userId: String(session.user.id),
          userName: String(session.user.name),
        }),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);

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

      const responseData = await res.json();
      console.log("Success response:", responseData);
      success();
    } catch (error) {
      console.error("Network error:", error);

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
        key={animeId}
        href={`/anime/${animeId}`}
        className="flex flex-col gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity duration-200"
      >
        <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <Image
              src={animeImage}
              width={180}
              height={200}
              alt={animeName}
              className="object-cover bg-blue-950 w-full aspect-[9/13] hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h2 className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2">
            {animeName}
          </h2>
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
