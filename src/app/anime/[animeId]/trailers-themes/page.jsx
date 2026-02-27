"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Loader from "../../../../../components/loader/Loader";
import Link from "next/link";
import { nanoid } from "nanoid";
import { Youtube } from "lucide-react";

export default function TrailerThemePage({ params }) {
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;
  const [animeTitle, setAnimeTitle] = useState("");

  const [animeVideos, setAnimeVideos] = useState({
    error: false,
    loading: false,
    trailers: [],
    musicVideos: [],
  });

  async function getAnimeTitle() {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
      if (!res.ok) throw new Error("An error has occurred");
      const result = await res.json();
      setAnimeTitle(result.data?.title);
    } catch (error) {
      console.error(error.message);
      setAnimeTitle("");
    }
  }

  async function getAnimeVideos() {
    setAnimeVideos((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/videos`,
      );
      if (!response.ok) {
        throw new Error(`An error has occurred ${response.status}`);
      }
      const result = await response.json();
      setAnimeVideos({
        error: false,
        loading: false,
        trailers: result.data.promo,
        musicVideos: result.data.music_videos,
      });
    } catch (error) {
      console.error(error.message);
      setAnimeVideos((prev) => ({ ...prev, loading: false, error: true }));
    }
  }

  useEffect(() => {
    getAnimeVideos();
    getAnimeTitle();
  }, [animeId]);

  if (animeVideos.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-xl text-red-500">
          Something went wrong, try again
        </h1>
      </div>
    );
  }

  if (animeVideos.loading) {
    return <Loader />;
  }

  if (!animeVideos.error && animeId && animeVideos) {
    return (
      <div className="flex flex-col gap-10 text-white">
        <section className=" flex flex-col gap-5">
          <div className=" flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Trailers</h1>
            <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
          </div>

          <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
            {animeVideos.trailers && animeVideos.trailers.length > 0 ? (
              animeVideos.trailers.map((element, index) => (
                <div
                  key={nanoid(10)}
                  className="bg-white/5 p-5 flex flex-col gap-1 rounded-lg"
                >
                  <iframe
                    className="w-full rounded-sm h-[10rem]"
                    src={element.trailer.embed_url.replace(
                      "autoplay=1",
                      "autoplay=0",
                    )}
                    title={`${element?.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className=" flex flex-col gap-1">
                    <p className=" font-medium">{element?.title}</p>
                    <Link target="_blank" href={element.trailer.url || "#"}>
                      <button className=" border border-white bg-transparent px-4 py-1 rounded-sm cursor-pointer flex flex-row justify-center items-center gap-1 text-white">
                        <p>Watch on Youtube</p>
                        <Youtube size={20} color="#ffffff" strokeWidth={1.5} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className=" text-gray-300 font-medium text-lg">
                No trailer available
              </p>
            )}
          </div>
        </section>

        <section className=" flex flex-col gap-5">
          <div className=" flex flex-col gap-2">
            <h1 className="text-xl font-bold">Opening And Endings</h1>
            <span className=" w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
          </div>

          <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
            {animeVideos.musicVideos && animeVideos.musicVideos.length > 0 ? (
              animeVideos.musicVideos.map((element, index) => (
                <div
                  key={nanoid(10)}
                  className="bg-white/5 p-5 flex flex-col gap-1 rounded-lg"
                >
                  <iframe
                    className="w-full rounded-sm h-[10rem]"
                    src={element.video.embed_url.replace(
                      "autoplay=1",
                      "autoplay=0",
                    )}
                    title={`${element?.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className=" flex flex-col gap-1">
                    <p className=" font-medium">{element?.title}</p>
                    <Link
                      target="_blank"
                      href={
                        element?.video?.url ||
                        `https://www.youtube.com/results?search_query=${animeTitle} ${element?.title}`
                      }
                    >
                      <button className=" border border-white bg-transparent px-4 py-1 rounded-sm cursor-pointer flex flex-row justify-center items-center gap-1 text-white">
                        <p>Watch on Youtube</p>
                        <Youtube size={20} color="#ffffff" strokeWidth={1.5} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className=" text-gray-300 font-medium text-lg">
                No opening & ending available
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }
}
