import React from "react";
import { Calendar, Tag, Newspaper, Clapperboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { nanoid } from "nanoid";
import fetchAnime from "../../../../utils/fetchAnime";

export async function generateMetadata({ params }) {
  const { mangaId: id } = await params;

  const res = await fetch(`https://api.jikan.moe/v4/manga/${id}/full`);
  const result = await res.json();

  if (result) {
    return {
      title: {
        template: ` ${result.data.title} - %s | AnimeVista`,
        default: `${result.data.title} | AnimeVista`,
      },
      description: `${result.data.synopsis}`,
    };
  }
}

export default async function layout({ children, params }) {
  //const mangaId = params.mangaId;
  const { mangaId } = await params;

  const mangaData = await fetchAnime(
    `https://api.jikan.moe/v4/manga/${mangaId}/full`
  );

  if (!mangaData) {
    return (
      <div className=" flex flex-col gap-3 items-center text-white w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className=" text-2xl font-semibold">Something went wrong</h1>
        <p className="text-red-500">An error has occurred, please try again</p>
      </div>
    );
  }

  if (mangaData && mangaData.data) {
    return (
      <div className="relative pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Poster Image */}
            <div className="flex-shrink-0 self-center ">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <Image
                    src={mangaData.data.images.jpg.large_image_url}
                    alt={mangaData.data.title}
                    className="object-cover rounded-xl shadow-2xl border border-white/10"
                    width={280}
                    height={400}
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <h1
                  className={` text-4xl lg:text-5xl text-white font-bold leading-tight`}
                >
                  {mangaData.data.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      mangaData.data.status === "Publishing"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "bg-green-500/20 text-green-300 border border-green-500/30"
                    }`}
                  >
                    {mangaData.data.status}
                  </span>

                  <div className="flex items-center justify-center gap-1 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                    <span className=" text-blue-400">
                      <Calendar size={16} strokeWidth={2.25} />
                    </span>
                    <span className="text-blue-300 font-medium">
                      {mangaData.data.published.string}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                    <svg
                      className="w-4 h-4 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-amber-300 font-medium">
                      {mangaData.data.score}
                    </span>
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <p className="text-slate-200 leading-relaxed text-base">
                  {mangaData.data.synopsis}
                </p>
              </div>

              {/* Meta Information */}
              <div className=" flex flex-wrap gap-5 md:gap-7">
                {/* Genres */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Tag className=" text-purple-400" size={20} />
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mangaData.data.genres.map((genre) => (
                      <span
                        key={nanoid(10)}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Magazine */}
                {mangaData.data.serializations.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Newspaper className=" text-orange-400" size={20} />
                      Magazine
                      {mangaData.data.serializations.length > 1 ? "s" : ""}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {mangaData.data.serializations.map((magazine) => (
                        <span
                          key={nanoid(10)}
                          className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30 hover:bg-purple-orange/30 transition-colors"
                        >
                          {magazine.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {/* TYPE */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clapperboard className=" text-red-400" size={20} />
                    Type
                  </h3>

                  <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-medium border border-red-500/30 hover:bg-red-500/30 transition-colors">
                    {mangaData.data.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className=" mt-10 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10">
              <nav className="flex flex-wrap justify-evenly gap-1">
                <Link
                  href={`/manga/${mangaId}`}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 hover:text-white"
                >
                  Overview
                </Link>

                <Link
                  href={`/manga/${mangaId}/characters`}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 hover:text-white"
                >
                  Characters
                </Link>

                <Link
                  href={`/manga/${mangaId}/reviews`}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 hover:text-white"
                >
                  Reviews
                </Link>

                <Link
                  href={`/manga/${mangaId}/recommendations`}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200 hover:text-white"
                >
                  Recommendations
                </Link>
              </nav>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 lg:p-8">{children}</div>
          </div>
        </div>
      </div>
    );
  }
}
