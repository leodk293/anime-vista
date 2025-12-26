"use client";
import React from "react";
import { useState, useEffect, use, useCallback } from "react";
import Loader from "../../../../../components/loader/Loader";
import Link from "next/link";
import MangaCharacters from "../../../../../components/MangaCharacters";
import MangaRecommendations from "../../../../../components/MangaRecommendations";
import { Chart } from "react-google-charts";

export default function MangaDetails({ params }) {
  const resolvedParams = use(params);
  const mangaId = resolvedParams.mangaId;

  const [mangaData, setMangaData] = useState({
    error: false,
    loading: false,
    data: null,
  });

  const [statistics, setStatistics] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(false);

  const getMangaDetails = useCallback(async () => {
    setMangaData({
      error: false,
      loading: true,
      data: null,
    });
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/manga/${mangaId}/full`
      );
      if (!res.ok) {
        throw new Error("An error has occurred");
      }
      const result = await res.json();
      setMangaData({
        error: false,
        loading: false,
        data: result.data,
      });
    } catch (error) {
      console.error(error.message);
      setMangaData({
        error: true,
        loading: false,
        data: null,
      });
    }
  }, [mangaId]);

  const getStatistics = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(false);
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/manga/${mangaId}/statistics`
      );
      if (!res.ok) {
        throw new Error(`An error has occurred`);
      }
      const result = await res.json();
      setStatistics(result.data);
    } catch (error) {
      console.error(error.message);
      setStatistics(null);
      setStatsError(true);
    } finally {
      setStatsLoading(false);
    }
  }, [mangaId]);

  useEffect(() => {
    if (!mangaId) return;

    getMangaDetails();
    getStatistics();
  }, [mangaId, getMangaDetails, getStatistics]);

  const getChartData = useCallback(() => {
    if (
      !statistics ||
      !statistics.scores ||
      !Array.isArray(statistics.scores)
    ) {
      return null;
    }

    const chartData = [["Score", "Votes"]];

    // scores is an array of objects with score and votes
    statistics.scores.forEach((item) => {
      if (
        item &&
        typeof item.score !== "undefined" &&
        typeof item.votes !== "undefined"
      ) {
        chartData.push([`Score ${item.score}`, item.votes]);
      }
    });

    return chartData.length > 1 ? chartData : null;
  }, [statistics]);

  const chartOptions = {
    title: "Score Distribution",
    backgroundColor: "transparent",
    titleTextStyle: {
      color: "#fff",
      fontSize: 18,
      bold: true,
    },
    legend: {
      textStyle: { color: "#fff" },
    },
    hAxis: {
      textStyle: { color: "#fff" },
      titleTextStyle: { color: "#fff" },
    },
    vAxis: {
      textStyle: { color: "#fff" },
      titleTextStyle: { color: "#fff" },
      title: "Number of Votes",
    },
    colors: ["#1e40af"],
    chartArea: { width: "80%", height: "70%" },
  };

  if (mangaData.error) {
    return (
      <div className="flex flex-col gap-3 items-center text-white w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <button
          className="border border-transparent font-medium rounded-xl text-white bg-blue-900 px-4 py-2 cursor-pointer hover:bg-blue-800 transition-colors"
          onClick={getMangaDetails}
        >
          Try again
        </button>
      </div>
    );
  }

  if (mangaData.loading) {
    return <Loader />;
  }

  if (mangaData.data && mangaId) {
    const chartData = getChartData();

    return (
      <div className="text-white flex flex-col gap-10">
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg sm:text-xl font-semibold">
              Author{mangaData.data.authors?.length > 1 ? "s" : ""}
            </h2>
            <div className="flex flex-wrap gap-2 items-center">
              {mangaData.data.authors && mangaData.data.authors.length > 0 ? (
                mangaData.data.authors.map((author, idx) => (
                  <span
                    key={author.mal_id || idx}
                    className="bg-slate-800/50 px-2 border border-gray-700 italic text-gray-200 rounded py-1 text-sm font-medium"
                  >
                    {author.name}
                    {author.type ? (
                      <span className="ml-2 text-xs text-gray-400">
                        ({author.type})
                      </span>
                    ) : null}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">Unknown</span>
              )}
            </div>
          </div>
          {mangaData.data.background && (
            <p className="text-slate-200 leading-relaxed text-base">
              {mangaData.data.background}
            </p>
          )}
        </section>

        <section className="flex flex-col gap-5">
          <h1 className="text-xl sm:text-2xl font-bold">Statistics</h1>

          {statsLoading ? (
            <div className="text-gray-400">Loading statistics...</div>
          ) : statsError ? (
            <div className="flex flex-col gap-3 items-start">
              <p className="text-gray-400">Unable to load statistics</p>
              <button
                className="border border-transparent font-medium rounded-xl text-white bg-blue-900 px-4 py-2 cursor-pointer hover:bg-blue-800 transition-colors text-sm"
                onClick={getStatistics}
              >
                Retry Statistics
              </button>
            </div>
          ) : statistics ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Reading</p>
                  <p className="text-2xl font-bold">
                    {statistics.reading?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold">
                    {statistics.completed?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">On Hold</p>
                  <p className="text-2xl font-bold">
                    {statistics.on_hold?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Dropped</p>
                  <p className="text-2xl font-bold">
                    {statistics.dropped?.toLocaleString() || 0}
                  </p>
                </div>
              </div>

              {chartData && (
                <div className="bg-slate-800/30 border border-gray-700 rounded-lg p-4">
                  <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">No statistics available</p>
          )}
        </section>

        <div className="flex flex-col">
          <Link href={`/manga/${mangaId}/characters`}>
            <h1 className="text-xl sm:text-2xl font-bold hover:text-gray-400 duration-300">
              Characters
            </h1>
          </Link>
          <div className="mt-5">
            <MangaCharacters mangaId={mangaId} length={8} />
          </div>
        </div>

        {/* <div className="flex flex-col">
          <Link href={`/manga/${mangaId}/recommendations`}>
            <h1 className="text-xl sm:text-2xl font-bold hover:text-gray-400 duration-300">
              Recommendations
            </h1>
          </Link>
          <div className="mt-5">
            <MangaRecommendations mangaId={mangaId} length={8} />
          </div>
        </div> */}
      </div>
    );
  }

  return null;
}