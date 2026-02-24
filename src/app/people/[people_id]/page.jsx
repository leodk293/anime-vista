"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import Image from "next/image";
import Loader from "../../../../components/loader/Loader";
import Anonym from "../../../../public/anonym-profile-picture.jpeg";

export default function PeoplePage({ params }) {
  const resolvedParams = use(params);
  const { people_id } = resolvedParams;

  const [peopleData, setPeopleData] = useState({
    data: null,
    loading: true,
    error: false,
  });

  async function getPeopleData() {
    setPeopleData((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/people/${people_id}/full`,
      );
      if (!response.ok) {
        setPeopleData((prev) => ({ ...prev, loading: false, error: true }));
        throw new Error(`Failed to fetch voice actor: ${response.status}`);
      }
      const result = await response.json();
      setPeopleData({ data: result.data, loading: false, error: false });
    } catch (error) {
      console.error(error.message);
      setPeopleData((prev) => ({ ...prev, loading: false, error: true }));
    }
  }

  function formatBirthday(isoDateString) {
    if (!isoDateString) return "Unknown";
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return "Unknown";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  useEffect(() => {
    getPeopleData();
  }, [people_id]);

  if (!people_id) {
    return (
      <div className="flex flex-col items-center mt-40 justify-center gap-4">
        <h1 className="text-xl text-red-500">Invalid people Id</h1>
      </div>
    );
  }

  if (peopleData.loading) return <Loader />;

  if (peopleData.error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl text-red-500">
          Failed to load voice actor data. Please try again.
        </h1>
      </div>
    );
  }

  const data = peopleData.data;

  return (
    <>
      {data && (
        <div className="relative max-w-5xl text-white pt-24 pb-16 mx-auto px-4 flex flex-col gap-16">

          {/* ── HERO ── */}
          <section className="flex flex-col md:flex-row gap-10 items-start">

            {/* Portrait */}
            <div className="relative flex-shrink-0 self-center md:self-start">
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-blue-500/40 via-transparent to-blue-900/30 z-0" />
              <Image
                width={220}
                height={320}
                src={
                  data.images?.jpg?.image_url ===
                  "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
                    ? Anonym
                    : data.images?.jpg?.image_url
                }
                alt={data.name}
                className="relative z-10 rounded-xl object-cover w-[220px] h-[320px] shadow-2xl shadow-black/60"
              />
              {/* <span className="absolute bottom-3 left-3 z-20 bg-blue-600/80 backdrop-blur-sm text-white text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full">
                Voice Actor
              </span> */}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5 flex-1">

              {/* Name block */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-blue-400 flex items-center gap-2">
                  <span className="inline-block w-6 h-px bg-blue-400" />
                  Profile
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                  {data.name}
                </h1>
                {data.family_name && (
                  <p className="text-lg text-gray-400 font-medium italic">
                    {data.family_name}
                  </p>
                )}
                {data.alternate_names?.length > 0 && (
                  <p className="text-xs text-gray-500 tracking-widest mt-1">
                    {data.alternate_names.join("  ·  ")}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-blue-800/60 to-transparent" />

              {/* Meta */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-blue-400 w-16">
                    Born
                  </span>
                  <span className="text-sm text-gray-300">
                    {formatBirthday(data.birthday)}
                  </span>
                </div>
                {data.website_url && (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-blue-400 w-16">
                      Web
                    </span>
                    <Link
                      href={data.website_url}
                      target="_blank"
                      className="text-sm text-blue-300 hover:text-blue-200 underline underline-offset-2 decoration-blue-800 hover:decoration-blue-400 transition-all duration-200"
                    >
                      {data.website_url.replace(/^https?:\/\//, "")}
                    </Link>
                  </div>
                )}
              </div>

              {/* About */}
              {data.about ? (
                <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-blue-800/60 pl-4 max-w-2xl">
                  {data.about}
                </p>
              ) : (
                <p className="text-sm italic text-gray-600">
                  No biography available.
                </p>
              )}
            </div>
          </section>

          {/* ── CHARACTERS ── */}
          {data.voices?.length > 0 &&
            (() => {
              const seen = new Set();
              const uniqueVoices = data.voices.filter((el) => {
                const id = el?.character?.mal_id;
                if (!id || seen.has(id)) return false;
                seen.add(id);
                return true;
              });
              return (
                <section className="flex flex-col gap-6">
                  <div className="flex items-baseline gap-4">
                    <h2 className="text-2xl font-bold text-white">Characters</h2>
                    <span className="text-xs font-semibold tracking-widest uppercase text-blue-400">
                      {uniqueVoices.length} roles
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-800/50 to-transparent" />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {uniqueVoices.map((el) => (
                      <Link
                        href={`/${el?.anime?.mal_id}/character/${el?.character?.mal_id}`}
                        key={el?.character?.mal_id || nanoid(10)}
                        className="group flex flex-col gap-2"
                      >
                        <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-900 ring-1 ring-white/5 group-hover:ring-blue-500/40 transition-all duration-300">
                          {el?.character?.images?.jpg?.image_url && (
                            <Image
                              fill
                              src={el.character.images.jpg.image_url}
                              alt={el?.character?.name ?? "character"}
                              className="object-cover transition-transform duration-500 group-hover:scale-105 saturate-[0.85] group-hover:saturate-100"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <p className="text-[11px] text-gray-500 group-hover:text-gray-300 font-medium line-clamp-2 leading-snug transition-colors duration-200">
                          {el?.character?.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })()}

          {/* ── FILMOGRAPHY ── */}
          {data.anime?.length > 0 && (
            <section className="flex flex-col gap-6">
              <div className="flex items-baseline gap-4">
                <h2 className="text-2xl font-bold text-white">Filmography</h2>
                <span className="text-xs font-semibold tracking-widest uppercase text-blue-400">
                  {data.anime.length} titles
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-800/50 to-transparent" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {data.anime.map((item) => (
                  <Link
                    href={`/anime/${item?.anime?.mal_id}`}
                    key={item?.anime?.mal_id || nanoid(10)}
                    className="group flex flex-col gap-2"
                  >
                    <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-900 ring-1 ring-white/5 group-hover:ring-blue-500/40 transition-all duration-300">
                      {item?.anime?.images?.jpg?.large_image_url && (
                        <Image
                          fill
                          src={item.anime.images.jpg.large_image_url}
                          alt={item?.anime?.title ?? "anime"}
                          className="object-cover transition-transform duration-500 group-hover:scale-105 saturate-[0.85] group-hover:saturate-100"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <p className="text-[11px] text-gray-500 group-hover:text-gray-300 font-medium line-clamp-2 leading-snug transition-colors duration-200">
                      {item?.anime?.title}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}