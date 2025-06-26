"use client";
import React, { useState, useEffect } from "react";
import AnimeBox from "./AnimeBox";
import { nanoid } from "nanoid";
import Loader from "./loader/Loader";

const AnimeType = ({ animeTypeName, url }) => {
  const [animeData, setAnimeData] = useState({
    error: false,
    loading: false,
    data: [],
  });

  async function getAnime() {
    try {
      setAnimeData((prev) => ({ ...prev, loading: true }));
      const response = await fetch(`${url}`);
      if (!response.ok) {
        throw new Error("Failed to fetch anime data");
      }
      const data = await response.json();
      setAnimeData({ error: false, loading: false, data: data.data });
    } catch (error) {
      console.log(error);
      setAnimeData({ error: true, loading: false, data: [] });
    }
  }

  useEffect(() => {
    getAnime();
  }, []);

  return (
    <div className=" mt-[4rem] max-w-5xl flex flex-col gap-7 items-center mx-auto">
      <div className=" w-full flex flex-col gap-1">
        <h1 className=" text-white text-3xl font-bold">{animeTypeName}</h1>
        <span className=" p-1 rounded-xl bg-blue-800 w-[10%]" />
      </div>
      {animeData.error === true ? (
        <p className="text-center text-red-500">Try again...</p>
      ) : animeData.loading === true ? (
        <Loader />
      ) : (
        animeData.data &&
        (animeData.data.length === 0 ? (
          <p className=" text-center text-xl font-medium h-[15rem] text-white">No anime found...</p>
        ) : (
          <div className="w-full mt-5 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {animeData.data
              .filter(
                (anime, index, self) =>
                  index === self.findIndex((a) => a.mal_id === anime.mal_id)
              )
              .map((anime) => (
                <div key={nanoid(10)}>
                  <AnimeBox
                    animeId={anime.mal_id}
                    animeImage={
                      anime.images.jpg.large_image_url
                        ? anime.images.jpg.large_image_url
                        : anime.images.jpg.image_url
                    }
                    animeName={
                      anime.title_english ? anime.title_english : anime.title
                    }
                  />
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AnimeType;
