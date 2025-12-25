"use client";
import React, { useState, useEffect, use } from "react";
import Loader from "../../../../components/loader/Loader";
import ReadMore from "../../../../components/readMore";
import Image from "next/image";
import Link from "next/link";
import { nanoid } from "nanoid";

export default function MangaCharacter({ params }) {
 
  const resolvedParams = use(params);
  const characterId = resolvedParams.characterId;

  const [character, setCharacter] = useState({
    error: false,
    data: null,
    loading: false,
  });

  async function getCharacterData() {
    setCharacter({
      error: false,
      data: null,
      loading: true,
    });
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/characters/${characterId}`
      );
      if (!res.ok) {
        throw new Error("An error has occurred");
      }
      const result = await res.json();
      setCharacter({
        error: false,
        data: result.data,
        loading: false,
      });
    } catch (error) {
      console.error(error.message);
      setCharacter({
        error: true,
        data: null,
        loading: false,
      });
    }
  }

  const [manga, setManga] = useState([]);

  async function getManga() {
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/characters/${characterId}/manga`
      );
      if (!res.ok) {
        throw new Error("Error occurred");
      }
      const result = await res.json();
      setManga(result.data);
    } catch (error) {
      console.error(error.message);
      setManga([]);
    }
  }

  useEffect(() => {
    getCharacterData();
    getManga();
  }, [characterId]);

  if (character.loading) {
    return <Loader />;
  }

  if (character.error) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-xl text-red-500">
          Failed to load character data. Please try again later.
        </h1>
      </div>
    );
  }

  if (character.data && characterId) {
    return (
      <div className="relative max-w-6xl text-white pt-20 pb-12 mx-auto flex flex-col items-center gap-10 justify-center">
        <section className="w-full flex flex-col md:flex-row items-center justify-center gap-8">
          {character?.data?.images?.jpg?.image_url && (
            <Image
              width={250}
              height={400}
              src={character.data.images.jpg.image_url}
              alt={character.data.name}
              className="rounded-lg border border-gray-300 object-cover"
            />
          )}

          <div className="flex flex-col items-center md:items-start w-full md:w-[70%] gap-5">
            <h1 className="text-gray-50 text-3xl font-extrabold md:text-4xl text-center md:text-left">
              {character.data.name}
            </h1>
            <p className="text-2xl font-bold text-gray-300 text-center md:text-left">
              {character.data.name_kanji}
            </p>
            {character.data.nicknames && character.data.nicknames.length > 0 ? (
              <p className="text-gray-100 font-semibold text-lg text-center md:text-left">
                Nicknames : {character.data.nicknames.join(", ")}
              </p>
            ) : (
              ""
            )}

            {character.data.about ? (
              <ReadMore
                text={character.data.about}
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

        {manga && manga.length > 0 && (
          <section className=" mt-5 flex flex-col gap-2">
            <div className=" flex flex-col gap-2">
              <h1 className=" text-2xl font-bold">Present in :</h1>
              <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
            </div>
            <div className="w-full mt-5 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {
                manga.map((element) => (
                  <Link
                    key={nanoid(10)}
                    href={`/manga/${element.manga.mal_id}`}
                    className="flex flex-col gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity duration-200"
                  >
                    <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                      <div className="overflow-hidden rounded-lg border border-gray-700">
                        <Image
                          src={element.manga.images.jpg.large_image_url}
                          width={180}
                          height={200}
                          alt={element.manga.title}
                          className="object-cover bg-gray-900 w-full aspect-[9/13] hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h2 className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2">
                        {element.manga.title}
                      </h2>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return null;
}
