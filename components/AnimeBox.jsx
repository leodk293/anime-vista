"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export default function AnimeBox({ animeId, animeImage, animeName }) {
  const { data: session, status } = useSession();
  const [isHovered, setIsHovered] = useState(false);

  const success = () => {
    toast.success("Added to favorite list", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const alreadyAdded = () => {
    toast("Already added to favorite list", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const loginAlert = () => {
    toast.error("Login first to add anime to your favorite list.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  /*const handleAddToFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "unauthenticated") {
      loginAlert();
      return;
    }

    try {
      const res = fetch("/api/add-to-favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animeId,
          animeTitle: animeName,
          animePoster: animeImage,
          userId: session?.user?.id,
        }),
      });
      if (res.ok) {
        success();
      } 
      if(res.status === 409) {
        alreadyAdded();
      }
    } catch (error) {
      console.log(error);
    }

    console.log(`Added ${animeName} to favorites`);
  };*/

  const handleAddToFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "unauthenticated") {
      loginAlert();
      return;
    }

    try {
      const res = await fetch("/api/add-to-favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animeId,
          animeTitle: animeName,
          animePoster: animeImage,
          userId: session?.user?.id,
        }),
      });

      if (res.ok) {
        success();
      } else if (res.status === 409) {
        alreadyAdded();
      } else {
        // Handle other error cases
        toast.error("Failed to add anime to favorites");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Network error. Please try again.");
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
          <Image
            src={animeImage}
            width={180}
            height={200}
            alt={animeName}
            className="rounded-lg border border-gray-700 object-cover w-full aspect-[9/13]"
          />
          <h2 className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2">
            {animeName}
          </h2>
        </div>
      </Link>

      {isHovered && (
        <div className="absolute top-2 right-2 z-10">
          <button
            title="Add to favorite"
            onClick={handleAddToFavorite}
            className="bg-black/80 cursor-pointer text-white px-3 py-1.5 rounded-md text-[16px] font-medium hover:bg-gray-900 transition-colors duration-200 backdrop-blur-sm border border-gray-600"
          >
            Add to favorite
          </button>
        </div>
      )}
    </div>
  );
}
