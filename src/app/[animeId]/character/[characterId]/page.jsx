"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Loader from "../../../../../components/loader/Loader";
import ReadMore from "../../../../../components/readMore";
import AnimeBox from "../../../../../components/AnimeBox";

export default function CharacterPage({ params }) {
  const resolvedParams = use(params);
  const { animeId, characterId } = resolvedParams;

  const [animePoster, setAnimePoster] = useState(null);
  const [animeCharacterData, setAnimeCharacterData] = useState({
    error: false,
    loading: false,
    data: null,
  });

  async function getAnimePoster() {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch anime data");
      }
      const result = await res.json();
      setAnimePoster(result.data.images.jpg.large_image_url);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getAnimeCharacterData() {
    setAnimeCharacterData((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/characters/${characterId}/full`
      );
      if (!response.ok) {
        setAnimeCharacterData((prev) => ({
          ...prev,
          loading: false,
          error: true,
        }));
        throw new Error("Failed to fetch character data");
      }
      const result = await response.json();
      setAnimeCharacterData((prev) => ({
        ...prev,
        loading: false,
        data: result.data,
      }));
    } catch (error) {
      console.error(error.message);
      setAnimeCharacterData((prev) => ({
        ...prev,
        loading: false,
        error: true,
      }));
    }
  }

  useEffect(() => {
    getAnimePoster();
  }, [animeId]);

  useEffect(() => {
    getAnimeCharacterData();
  }, [characterId]);

  if (!animeId || !characterId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-xl text-red-500">Invalid ID provided.</h1>
      </div>
    );
  }

  if (animeCharacterData.loading) {
    return <Loader />;
  }

  if (animeCharacterData.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-xl text-red-500">
          Failed to load character data. Please try again later.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {animePoster && (
        <div className="fixed inset-0 -z-10 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900" />
          <Image
            src={animePoster}
            alt="Background"
            fill
            className="object-cover blur-sm"
            priority
          />
        </div>
      )}

      
      <div className="relative max-w-6xl text-white pt-20 pb-12 mx-auto flex flex-col items-center gap-10 justify-center">
        <section className="w-full flex flex-col md:flex-row items-center justify-center gap-8">
          {animeCharacterData?.data?.images.jpg.image_url && (
            <Image
              width={250}
              height={400}
              src={animeCharacterData?.data?.images.jpg.image_url}
              alt={animeCharacterData?.data?.name}
              className="rounded-lg border border-gray-300 object-cover"
            />
          )}

          <div className="flex flex-col items-center md:items-start w-full md:w-[70%] gap-5">
            <h1 className="text-gray-50 text-3xl font-extrabold md:text-4xl text-center md:text-left">
              {animeCharacterData?.data?.name}
            </h1>
            <p className="text-2xl font-bold text-gray-300 text-center md:text-left">
              {animeCharacterData?.data?.name_kanji}
            </p>
            {animeCharacterData?.data?.nicknames.length > 0 ? (
              <p className="text-gray-100 font-semibold text-lg text-center md:text-left">
                Nicknames : {animeCharacterData?.data?.nicknames.join(", ")}
              </p>
            ) : (
              ""
            )}

            {animeCharacterData?.data?.about ? (
              <ReadMore
                text={animeCharacterData?.data?.about}
                textSize={"text-[17px]"}
                maxLength={500}
              />
            ) : (
              <p className="text-xl font-bold text-gray-300">
                No information found
              </p>
            )}
          </div>
        </section>

        <section className=" mt-5 flex flex-col gap-2">
          <div className=" flex flex-col gap-2">
            <h1 className=" text-2xl font-bold">Present in :</h1>
            <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
          </div>
          <div className="w-full mt-5 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {animeCharacterData?.data?.anime &&
              animeCharacterData?.data?.anime.map((element) => (
                <AnimeBox
                  key={element?.anime?.mal_id}
                  animeId={element?.anime?.mal_id}
                  animeImage={element?.anime?.images?.jpg?.large_image_url}
                  animeName={element?.anime?.title}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
