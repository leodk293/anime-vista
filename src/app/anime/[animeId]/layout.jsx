import React from "react";
import fetchAnimeData from "../../../../utils/fetchAnimeData";
import Image from "next/image";
import Link from "next/link";
import { nanoid } from "nanoid";
import { Tv, Calendar } from "lucide-react";

export default async function layout({ children, params }) {
  const { animeId } = params;
  const animeData = await fetchAnimeData(animeId);

  if (!animeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center p-8 bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-red-400 mb-2">
            Something went wrong
          </h1>
          <p className="text-red-300/80">
            An error has occurred, please try again
          </p>
        </div>
      </div>
    );
  }

  const title = animeData.data.title_english || animeData.data.title;
  const hasStreaming = animeData.data?.streaming?.length > 0;
  const isNotYetAired = animeData.data.status === "Not yet aired";
  const string = animeData.data.aired.string || "";

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900" />
        <Image
          src={animeData.data.images.jpg.large_image_url}
          alt="Background"
          fill
          className="object-cover blur-sm"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Poster Image */}
              <div className="flex-shrink-0 self-center ">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative">
                    <Image
                      src={animeData.data.images.jpg.large_image_url}
                      alt={title}
                      className="object-cover rounded-xl shadow-2xl border border-white/10"
                      width={280}
                      height={400}
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6">
                {/* Title and Status */}
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {title}
                  </h1>
                  {/* <p className=" text-white text-lg font-semibold">
                    Broadcast Period : {string}
                  </p> */}

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isNotYetAired
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : animeData.data.status === "Finished Airing"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {animeData.data.status}
                    </span>

                    <div className="flex items-center justify-center gap-1 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                      <span className=" text-blue-400">
                        <Calendar size={16} strokeWidth={2.25} />
                      </span>
                      <span className="text-blue-300 font-medium">
                        {string}
                      </span>
                    </div>

                    {animeData.data.score && (
                      <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                        <svg
                          className="w-4 h-4 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-amber-300 font-medium">
                          {animeData.data.score}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Synopsis */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <p className="text-slate-200 leading-relaxed text-base">
                    {animeData.data.synopsis || "No synopsis available"}
                  </p>
                </div>

                {/* Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Genres */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {animeData.data.genres.map((genre) => (
                        <span
                          key={nanoid(10)}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Streaming */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Tv className=" text-blue-400" size={20} />
                      Streaming
                    </h3>
                    {hasStreaming ? (
                      <div className="flex flex-wrap gap-2">
                        {animeData.data.streaming.map((platform) => (
                          <Link
                            key={nanoid(10)}
                            href={platform.url}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                          >
                            {platform.name}
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">
                        No streaming platforms available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10">
              <nav className="flex flex-wrap gap-1">
                <Link
                  href={`/anime/${animeId}`}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 hover:text-white"
                >
                  Overview
                </Link>
                {!isNotYetAired && (
                  <Link
                    href={`/anime/${animeId}/watch`}
                    className="px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 hover:text-white flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Watch
                  </Link>
                )}
                <Link
                  href={`/anime/${animeId}/characters`}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 hover:text-white"
                >
                  Characters
                </Link>
                <Link
                  href={`/anime/${animeId}/staff`}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 hover:text-white"
                >
                  Staff
                </Link>
                <Link
                  href={`/anime/${animeId}/reviews`}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 hover:text-white"
                >
                  Reviews
                </Link>

                <Link
                  href={`/anime/${animeId}/trailers-themes`}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 hover:text-white"
                >
                  Trailers & Themes
                </Link>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 lg:p-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
