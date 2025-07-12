"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import Image from "next/image";
import Loader from "../../../../components/loader/Loader";
import ReadMore from "../../../../components/readMore";

export default function VoiceActorPage({ params }) {
  const resolvedParams = use(params);
  const { voice_actor_id } = resolvedParams;
  const [voiceActorData, setVoiceActorData] = useState({
    data: [],
    loading: true,
    error: false,
  });

  async function getVoiceActorData() {
    setVoiceActorData((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/people/${voice_actor_id}/full`
      );
      if (!response.ok) {
        setVoiceActorData((prev) => ({ ...prev, loading: false, error: true }));
        throw new Error(`Failed to fetch voice actor: ${response.status}`);
      }
      const result = await response.json();
      setVoiceActorData({
        data: result.data,
        loading: false,
        error: false,
      });
    } catch (error) {
      console.error(error.message);
      setVoiceActorData((prev) => ({ ...prev, loading: false, error: true }));
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
    getVoiceActorData();
  }, [voice_actor_id]);

  if (!voice_actor_id) {
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-xl text-red-500">Invalid Voice Actor Id</h1>
    </div>;
  }

  if (voiceActorData.loading) {
    return <Loader />;
  }

  if (voiceActorData.error) {
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
      {voiceActorData.data && (
        <div className="relative max-w-6xl text-white pt-20 pb-12 mx-auto flex flex-col items-center gap-10 justify-center">
          <section className="w-full flex flex-col md:flex-row items-center justify-center gap-8">
            {voiceActorData?.data?.images.jpg.image_url && (
              <Image
                width={250}
                height={400}
                src={voiceActorData?.data?.images.jpg.image_url}
                alt={voiceActorData?.data?.name}
                className="rounded-lg border border-gray-300 object-cover"
              />
            )}

            <div className="flex flex-col items-center md:items-start w-full md:w-[70%] gap-4">
              <h1 className="text-gray-50 text-3xl font-extrabold md:text-4xl text-center md:text-left">
                {voiceActorData?.data?.name}
              </h1>
              <p className="text-2xl font-bold text-gray-300 text-center md:text-left">
                Family Name : {voiceActorData?.data?.family_name}
              </p>
              {voiceActorData?.data?.alternate_names.length > 0 ? (
                <p className="text-gray-100 font-semibold text-lg text-center md:text-left">
                  Alternate Names : {voiceActorData?.data?.nicknames.join(", ")}
                </p>
              ) : (
                ""
              )}

              <p className="text-2xl font-bold text-gray-300 text-center md:text-left">
                BirthDay : {formatBirthday(voiceActorData?.data?.birthday)}
              </p>

              {voiceActorData?.data?.website_url ? (
                <p className=" font-medium  text-lg text-gray-200">
                  Website :{" "}
                  <Link
                    className=" italic text-gray-300"
                    target="_blank"
                    href={voiceActorData?.data?.website_url}
                  >
                    {voiceActorData?.data?.website_url}
                  </Link>
                </p>
              ) : (
                ""
              )}

              {voiceActorData?.data?.about ? (
                <p className=" font-medium pt-5 text-lg text-gray-200">
                  {voiceActorData?.data?.about}
                </p>
              ) : (
                <p className="text-xl font-bold text-gray-300">
                  No information found
                </p>
              )}
            </div>
          </section>

          <section className=" mt-5 flex flex-col gap-2">
            <div className=" flex flex-col gap-2">
              <h1 className=" text-2xl font-bold">Played as :</h1>
              <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
            </div>
            <div className="w-full mt-5 self-center flex flex-wrap gap-4">
              {voiceActorData?.data?.voices &&
                (() => {
                  // Deduplicate by character mal_id
                  const seen = new Set();
                  const uniqueVoices = voiceActorData.data.voices.filter(
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
        </div>
      )}
    </div>
  );
}
