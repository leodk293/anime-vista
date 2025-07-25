"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import Image from "next/image";
import Loader from "../../../../components/loader/Loader";
import AnimeBox from "../../../../components/AnimeBox";
import Anonym from "../../../../public/anonym-profile-picture.jpeg";

export default function PeoplePage({ params }) {
  const resolvedParams = use(params);
  const { people_id } = resolvedParams;
  const [peopleData, setPeopleData] = useState({
    data: [],
    loading: true,
    error: false,
  });

  async function getPeopleData() {
    setPeopleData((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/people/${people_id}/full`
      );
      if (!response.ok) {
        setPeopleData((prev) => ({ ...prev, loading: false, error: true }));
        throw new Error(`Failed to fetch voice actor: ${response.status}`);
      }
      const result = await response.json();
      setPeopleData({
        data: result.data,
        loading: false,
        error: false,
      });
    } catch (error) {
      console.error(error.message);
      setPeopleData((prev) => ({ ...prev, loading: false, error: true }));
    }
  }

  function formatBirthday(isoDateString) {
    // Parse the ISO date string
    const date = new Date(isoDateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    // Format options for a readable birthday format
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Return formatted date
    return date.toLocaleDateString("en-US", options);
  }

  useEffect(() => {
    getPeopleData();
  }, [people_id]);

  if (!people_id) {
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-xl text-red-500">Invalid Voice Actor Id</h1>
    </div>;
  }

  if (peopleData.loading) {
    return <Loader />;
  }

  if (peopleData.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl text-red-500">
          Failed to load voice actor data. Please try again.
        </h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      {peopleData.data && (
        <div className="relative max-w-6xl text-white pt-20 pb-12 mx-auto flex flex-col items-center gap-10 justify-center">
          <section className="w-full flex flex-col md:flex-row items-center justify-center gap-8">
            {peopleData?.data?.images.jpg.image_url && (
              <Image
                width={250}
                height={400}
                src={
                  peopleData?.data?.images.jpg.image_url ===
                  "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
                    ? Anonym
                    : peopleData?.data?.images.jpg.image_url
                }
                alt={peopleData?.data?.name}
                className="rounded-lg border border-gray-300 object-cover"
              />
            )}

            <div className="flex flex-col items-center md:items-start w-full md:w-[70%] gap-4">
              <h1 className="text-gray-50 text-3xl font-extrabold md:text-4xl text-center md:text-left">
                {peopleData?.data?.name}
              </h1>
              <p className="text-2xl font-bold text-gray-300 text-center md:text-left">
                Family Name : {peopleData?.data?.family_name}
              </p>
              {peopleData?.data?.alternate_names.length > 0 ? (
                <p className="text-gray-100 font-semibold text-lg text-center md:text-left">
                  Alternate Names :{" "}
                  {peopleData?.data?.alternate_names.join(", ")}
                </p>
              ) : (
                ""
              )}

              <p className="text-2xl font-bold text-gray-300 text-center md:text-left">
                BirthDay : {formatBirthday(peopleData?.data?.birthday)}
              </p>

              {peopleData?.data?.website_url ? (
                <p className=" font-medium  text-lg text-gray-200">
                  Website :{" "}
                  <Link
                    className=" italic text-gray-300"
                    target="_blank"
                    href={peopleData?.data?.website_url}
                  >
                    {peopleData?.data?.website_url}
                  </Link>
                </p>
              ) : (
                ""
              )}

              {peopleData?.data?.about ? (
                <p className=" font-medium pt-5 text-lg text-gray-200">
                  {peopleData?.data?.about}
                </p>
              ) : (
                <p className="text-xl italic text-gray-300">
                  No information found
                </p>
              )}
            </div>
          </section>

          {peopleData?.data?.voices.length > 0 ? (
            <section className=" mt-5 flex flex-col gap-2">
              <div className=" flex flex-col gap-2">
                <h1 className=" text-2xl font-bold">Played as :</h1>
                <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
              </div>
              <div className="w-full mt-5 self-center flex flex-wrap gap-4">
                {peopleData?.data?.voices &&
                  (() => {
                    const seen = new Set();
                    const uniqueVoices = peopleData.data.voices.filter(
                      (element) => {
                        const id = element?.character?.mal_id;
                        if (!id || seen.has(id)) return false;
                        seen.add(id);
                        return true;
                      }
                    );
                    return uniqueVoices.map((element) => (
                      <Link
                        href={`/${element?.anime?.mal_id}/character/${element?.character?.mal_id}`}
                        key={element?.character?.mal_id || nanoid(10)}
                        className="flex flex-col gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity duration-200"
                      >
                        <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                          {element?.character?.images?.jpg?.image_url && (
                            <Image
                              width={100}
                              height={200}
                              src={element?.character?.images?.jpg?.image_url}
                              alt={element?.character?.name}
                              className="rounded-lg border border-gray-300 object-contain"
                            />
                          )}
                          <p className="text-gray-300 max-w-[100px] text-xs sm:text-sm font-medium line-clamp-2">
                            {element?.character?.name}
                          </p>
                        </div>
                      </Link>
                    ));
                  })()}
              </div>
            </section>
          ) : (
            <section className=" mt-5 flex flex-col gap-2">
              <div className=" flex flex-col gap-2">
                <h1 className=" text-2xl font-bold">Contribute to :</h1>
                <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
              </div>
              <div className=" mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.isArray(peopleData?.data?.anime) &&
                  peopleData.data.anime.map((element) => (
                    <AnimeBox
                      key={element?.anime?.mal_id}
                      animeId={element?.anime?.mal_id}
                      animeImage={element?.anime?.images?.jpg?.large_image_url}
                      animeName={element?.anime?.title}
                    />
                  ))}
                {Array.isArray(peopleData?.data?.anime) &&
                  peopleData.data.anime.length === 0 && (
                    <p className="text-gray-300 text-center">
                      No anime contributions found.
                    </p>
                  )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
