"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import Loader from "./loader/Loader";
import Anonym from "../public/anonym-profile-picture.jpeg";

export default function AnimeStaff({ animeId, slice }) {
  const [animeStaff, setAnimeStaff] = useState({
    data: [],
    loading: true,
    error: false,
    errorMessage: "",
  });

  async function fetchAnimeStaff() {
    setAnimeStaff((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/staff`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch staff: ${response.status}`);
      }
      const result = await response.json();
      setAnimeStaff({
        data: result.data,
        loading: false,
        error: false,
        errorMessage: "",
      });
    } catch (error) {
      console.error(error);
      setAnimeStaff({
        data: [],
        loading: false,
        error: true,
        errorMessage:
          "Failed to load staff information. Please try again later.",
      });
    }
  }

  useEffect(() => {
    fetchAnimeStaff();
  }, [animeId]);

  return (
    <>
      {animeStaff.loading ? (
        <Loader />
      ) : animeStaff.error ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500">{animeStaff.errorMessage}</p>
          <button
            onClick={fetchAnimeStaff}
            className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {animeStaff.data?.length > 0 ? (
            animeStaff.data
              .slice(0, slice !== 0 ? slice : animeStaff.data.length)
              .map((element) => (
                <div
                  className="flex flex-row items-center border border-gray-200/30 w-full justify-between bg-white/5 rounded-lg"
                  key={element.person.mal_id}
                >
                  <div className="flex flex-row items-center gap-2 sm:gap-4">
                    <div className="relative w-[60px] h-[80px] sm:w-[80px] sm:h-[100px]">
                      {element.person.images.jpg.image_url ===
                      "https://cdn.myanimelist.net/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c" ? (
                        <Image
                          src={Anonym}
                          alt="Picture not available"
                          fill
                          className="object-cover rounded-tl-md rounded-bl-md"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                      ) : (
                        <Image
                          src={element.person.images.jpg.image_url}
                          alt={element.person.name}
                          fill
                          className="object-cover rounded-tl-md rounded-bl-md"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col text-xs sm:text-sm gap-4 sm:gap-10">
                      <p className="text-white font-semibold line-clamp-1">
                        {element.person.name}
                      </p>
                      <p className="text-gray-400 line-clamp-2">
                        {element.positions.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-400">No staff information available</p>
          )}
        </div>
      )}
    </>
  );
}
