"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Loader from "../../../../../components/loader/Loader";
import Link from "next/link";
import { nanoid } from "nanoid";

export default function WatchPage({ params }) {
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;

  const [episodeList, setEpisodeList] = useState({
    data: undefined,
    length: "",
    error: false,
    loading: false,
  });

  async function getEpisodeList() {
    setEpisodeList((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/episodes`
      );
      if (!response.ok) {
        setEpisodeList((prev) => ({ ...prev, loading: false, error: true }));
        throw new Error(`An error has occurred : ${response.status}`);
      }
      const result = await response.json();
      setEpisodeList({
        data: result.data,
        length: result.data.length,
        error: false,
        loading: false,
      });
    } catch (error) {
      console.error(error.message);
      setEpisodeList((prev) => ({ ...prev, loading: false, error: true }));
    }
  }

  useEffect(() => {
    getEpisodeList();
  }, []);

  if (episodeList.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-xl text-red-500">
          Something went wrong, try again
        </h1>
      </div>
    );
  }

  if (episodeList.loading) {
    return <Loader />;
  }

  return (
    <div className=" flex flex-col gap-10 text-white">
      {episodeList.length && (
        <div className=" flex flex-col gap-2">
          <h1 className="text-xl font-bold">
            Episode List ({episodeList.length})
          </h1>
          <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
        </div>
      )}

      {episodeList.data && (
        <div className=" flex flex-col gap-5">
          {episodeList.data.map((element, index) => (
            <Link
              href={`/anime/${animeId}/watch/${index + 1}/episode`}
              key={nanoid(10)}
            >
              <div
                key={nanoid(10)}
                className=" border-b border-b-gray-600 rounded-tl-sm rounded-tr-sm p-2 flex flex-row justify-between md:text-[15px] hover:bg-white/5 duration-200"
              >
                <p>Episode {index + 1}</p>
                <p>
                  {element.title
                    ? element.title
                    : element.title_japanese
                      ? element.title_japanese
                      : element.title_romanji
                        ? element.title_romanji
                        : "No title available"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
