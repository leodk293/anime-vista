"use client";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Loader from "../../../../../../../components/loader/Loader";
import { MoveRight, MoveLeft } from "lucide-react";
import { nanoid } from "nanoid";

export default function EpisodePage({ params }) {
  const resolvedParams = use(params);
  const { animeId, episodeId } = resolvedParams;

  const [episodeData, setEpisodeData] = useState({
    error: false,
    loading: false,
    data: null,
  });

  const [episodeLink, setEpisodeLink] = useState(Number(episodeId));

  const [episodeListLength, setEpisodeListLength] = useState(null);
  const [tabEpisode, setTabEpisode] = useState([]);

  async function getEpisodeListLength() {
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/episodes`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch episode list: ${response.status}`);
      }
      const result = await response.json();
      setEpisodeListLength(result.data.length);
      for (let i = 0; i < result.data.length; i++) {
        setTabEpisode((prev) => [...prev, i + 1]);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function fetchEpisodeData() {
    setEpisodeData({
      error: false,
      loading: true,
      data: null,
    });
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/episodes/${episodeId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch episode data: ${response.status}`);
      }
      const result = await response.json();
      setEpisodeData({
        error: false,
        loading: false,
        data: result.data,
      });
    } catch (error) {
      console.error(error.message);
      setEpisodeData({
        error: true,
        loading: false,
        data: null,
      });
    }
  }

  useEffect(() => {
    getEpisodeListLength();
  }, [animeId]);

  useEffect(() => {
    fetchEpisodeData();
  }, [animeId, episodeId]);

  useEffect(() => {
    if (!episodeData.loading) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [episodeData.loading]);

  if (episodeData.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-xl text-red-500">
          Something went wrong, try again
        </h1>
      </div>
    );
  }

  if (episodeData.loading) {
    return <Loader />;
  }

  return (
    episodeData &&
    episodeData.data && (
      <div className=" max-w-10xl flex flex-col items-center text-white justify-center gap-4">
        <div className=" w-full flex flex-col items-center gap-4">
          <div className=" w-full flex flex-col items-center gap-4">
            <h1 className=" text-xl font-semibold md:text-3xl">
              {episodeData.data.title}
            </h1>
            <select
              // style={{
              //   backgroundColor: "rgba(255,255,255,0.05)",
              // }}
              className=" border border-transparent bg-white/5 text-lg font-medium outline-none px-5 py-2 rounded-lg cursor-pointer text-white self-start"
              value={episodeLink}
              onChange={(e) => {
                const selectedEpisode = Number(e.target.value);
                setEpisodeLink(selectedEpisode);
                window.location.href = `/anime/${animeId}/watch/${selectedEpisode}/episode`;
              }}
            >
              {tabEpisode.map((episode) => (
                <option
                  className="bg-gray-700 outline-none "
                  key={nanoid(10)}
                  value={Number(episode)}
                >
                  Episode {episode}
                </option>
              ))}
            </select>
          </div>
          <span className=" w-[90%] p-[1px] rounded-full bg-white/8" />
        </div>

        <div className=" w-full flex flex-col items-center gap-5">
          <section className="w-full flex flex-row justify-between">
            <Link
              href={
                Number(episodeId) === 1
                  ? ""
                  : `/anime/${animeId}/watch/${episodeLink - 1}/episode`
              }
              title={episodeLink - 1 === 0 ? "" : episodeLink - 1}
              className={`border border-transparent flex flex-row gap-2 justify-center items-center text-lg px-10 py-2 rounded-lg md:text-xl bg-white/5 ${
                Number(episodeId) === 1
                  ? "cursor-not-allowed opacity-80"
                  : "cursor-pointer"
              }`}
            >
              <MoveLeft strokeWidth="2.5" size={20} />
              <p>Prev</p>
            </Link>
            <Link
              href={
                Number(episodeId) === Number(episodeListLength)
                  ? ""
                  : `/anime/${animeId}/watch/${episodeLink + 1}/episode`
              }
              title={episodeLink + 1}
              className={`border border-transparent flex flex-row gap-2 justify-center items-center text-lg px-10 py-2 rounded-lg md:text-xl bg-white/5 ${
                Number(episodeId) === Number(episodeListLength)
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <p>Next</p>
              <MoveRight strokeWidth="2.5" size={20} />
            </Link>
          </section>

          <p className=" mt-5 w-[85%] leading-8 text-gray-200/100 text-[16px] md:text-lg">
            {episodeData.data.synopsis}
          </p>
        </div>
      </div>
    )
  );
}
