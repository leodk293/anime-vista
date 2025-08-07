"use client";
import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import Loader from "../../../components/loader/Loader";
import googleLogo from "../../../public/google-logo.png";

export default function WatchListPage() {
  const { status, data: session } = useSession();

  const [watchList, setWatchList] = useState({
    error: false,
    loading: false,
    data: [],
  });

  async function getWatchList() {
    if (!session?.user?.id) return;

    setWatchList((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const res = await fetch(`/api/watch-list?userId=${session?.user?.id}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      setWatchList({
        error: false,
        loading: false,
        data: result.animeList || [],
      });
    } catch (error) {
      setWatchList((prev) => ({ ...prev, error: true, loading: false }));
      console.error("Error fetching Watchlist:", error.message);
    }
  }

  async function removeFromWatchList(animeId) {
    if (!session?.user?.id || !animeId) return;

    try {
      const res = await fetch(
        `/api/watch-list?animeId=${animeId}&userId=${session.user.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      // Remove the anime from the local state
      setWatchList((prev) => ({
        ...prev,
        data: prev.data.filter((anime) => anime.animeId !== animeId),
      }));

      console.log("Anime removed from Watchlist successfully");
    } catch (error) {
      console.error("Error removing anime from Watchlist:", error.message);
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      getWatchList();
    }
  }, [session?.user?.id]);

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    return (
      <div className=" flex flex-col gap-5 items-center text-center text-xl mt-[5rem] h-screen text-white">
        <p>Please log in to view your Watchlist</p>
        <button
          onClick={() => signIn("google")}
          className="border border-transparent text-lg bg-gray-100 rounded-full cursor-pointer px-4 py-2 self-center flex flex-row gap-1 justify-center items-center"
        >
          <Image
            src={googleLogo}
            alt="Google"
            width={25}
            height={25}
            className="self-center object-contain"
          />
          <span className="self-center text-black font-medium">Login</span>
        </button>
      </div>
    );
  }

  if (watchList.error) {
    return (
      <div className="text-center mt-[5rem] h-screen">
        <p className="text-red-500 text-2xl mb-4">Error fetching Watchlist</p>
        <button
          onClick={getWatchList}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (watchList.loading) {
    return <Loader />;
  }

  return (
    <div className="mt-[4rem] max-w-5xl flex flex-col gap-7 items-center mx-auto px-4">
      <div className="w-full flex flex-col gap-1">
        <h1 className="text-white text-3xl font-bold">Watchlist</h1>
        <span className="p-1 rounded-xl bg-blue-800 w-[10%]" />
      </div>

      {watchList.data.length === 0 ? (
        <div className="text-center h-[15rem] w-full text-white mt-10">
          <p className="text-xl mb-4">Your Watchlist is empty</p>
          <Link href="/#genres" className="text-blue-500 hover:underline">
            Browse anime to add to your Watchlist
          </Link>
        </div>
      ) : (
        <div className="w-full mt-5 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {watchList.data.map((anime) => (
            <div
              key={anime.animeId || nanoid()}
              className="text-white flex flex-col gap-2 relative group"
            >
              <button
                onClick={() => removeFromWatchList(anime.animeId)}
                className="absolute cursor-pointer text-lg font-medium top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 z-10 opacity-0 duration-300 group-hover:opacity-100 transition-opacity"
                title="Remove from Watchlist"
              >
                Remove
              </button>

              <Link href={`/anime/${anime.animeId}`}>
                <div className="relative cursor-pointer overflow-hidden rounded-lg border border-gray-700">
                  <Image
                    src={anime.animePoster}
                    alt={anime.animeTitle}
                    width={180}
                    height={200}
                    className="object-cover w-full h-auto hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <p className="text-sm font-medium line-clamp-2">
                {anime.animeTitle}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
