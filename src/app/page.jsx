"use client";
import React, { useState, useEffect, useRef } from "react";
import { CircleX, MoveRight, RefreshCw, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import Link from "next/link";
import Image from "next/image";
import AnimeBox from "../../components/AnimeBox";
import SearchAnime from "../../components/SearchAnime";
import Loader from "../../components/loader/Loader";
import { Allerta } from "next/font/google";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allerta = Allerta({
  subsets: ["latin"],
  weight: "400",
});

const NUMBER_ANIME = "4,000";

const Home = () => {
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const { status, data: session } = useSession();

  const [showAllAnime, setShowAllAnime] = useState(false);

  async function getAnimeGenres() {
    try {
      const response = await fetch("https://api.jikan.moe/v4/genres/anime");
      if (!response.ok) {
        throw new Error("Failed to fetch anime genres");
      }
      const data = await response.json();
      setGenres(data.data);
    } catch (error) {
      console.error(error);
      setGenres([]);
    }
  }

  async function getAnimeYears() {
    try {
      const response = await fetch("https://api.jikan.moe/v4/seasons");
      if (!response.ok) {
        throw new Error("Failed to fetch anime years");
      }
      const data = await response.json();
      setYears(data.data);
    } catch (error) {
      console.error(error);
      setYears([]);
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      getAnimeGenres();
      getAnimeYears();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const seasons = ["Spring", "Fall", "Winter", "Summer"];

  const [animeData, setAnimeData] = useState({
    error: false,
    loading: false,
    data: [],
  });
  const [selectedAnimeType, setSelectedAnimeType] = useState("recent");
  const [animeTypeLink, setAnimeTypeLink] = useState("");

  async function getSelectedAnime() {
    try {
      setAnimeData((prev) => ({ ...prev, loading: true }));
      let url = "";
      switch (selectedAnimeType.toLowerCase()) {
        case "recent":
          url = "https://api.jikan.moe/v4/seasons/now";
          setAnimeTypeLink("/recent-anime");
          break;
        case "popular":
          url = "https://api.jikan.moe/v4/top/anime?filter=bypopularity";
          setAnimeTypeLink("/popular-anime");
          break;
        case "upcoming":
          url = "https://api.jikan.moe/v4/seasons/upcoming";
          setAnimeTypeLink("/upcoming-anime");
          break;
        case "top":
          url = "https://api.jikan.moe/v4/top/anime";
          setAnimeTypeLink("/top-anime");
          break;
        default:
          url = "https://api.jikan.moe/v4/seasons/now";
          setAnimeTypeLink("/");
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch anime data");
      }
      const data = await response.json();
      setAnimeData({ error: false, loading: false, data: data.data });
    } catch (error) {
      console.log(error);
      setAnimeData({ error: true, loading: false, data: [] });
    }
  }

  const [anime, setAnime] = useState({
    error: false,
    loading: false,
    data: [],
  });

  const refreshPage = () => {
    window.location.reload();
  };

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Session and timestamp tracking for state reset
  const [lastSessionId, setLastSessionId] = useState(null);
  const [lastVisitTime, setLastVisitTime] = useState(null);

  const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(`anime-filter-${key}`, value);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const getFromLocalStorage = (key, defaultValue = "") => {
    try {
      return localStorage.getItem(`anime-filter-${key}`) || defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  };

  const clearAllFilterState = () => {
    setSelectedSeason("");
    setSelectedYear("");
    setSelectedGenre("");
    setSearchTerm("");
    setShowAllAnime(false);

    // Clear localStorage
    saveToLocalStorage("season", "");
    saveToLocalStorage("year", "");
    saveToLocalStorage("genre", "");
    saveToLocalStorage("searchTerm", "");
    saveToLocalStorage("lastSessionId", "");
    saveToLocalStorage("lastVisitTime", "");
  };

  const shouldResetState = () => {
    const currentSessionId =
      session?.user?.email || session?.user?.id || "anonymous";
    const savedSessionId = getFromLocalStorage("lastSessionId");
    const savedVisitTime = getFromLocalStorage("lastVisitTime");

    if (savedSessionId && savedSessionId !== currentSessionId) {
      return true;
    }

    if (savedVisitTime) {
      const lastVisit = new Date(savedVisitTime);
      const now = new Date();
      const hoursDiff = (now - lastVisit) / (1000 * 60 * 60);
      if (hoursDiff > 24) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    if (shouldResetState()) {
      clearAllFilterState();
    } else {
      const savedYear = getFromLocalStorage("year");
      const savedSeason = getFromLocalStorage("season");
      const savedGenre = getFromLocalStorage("genre");
      const savedSearchTerm = getFromLocalStorage("searchTerm");

      if (savedYear) setSelectedYear(savedYear);
      if (savedSeason) setSelectedSeason(savedSeason);
      if (savedGenre) setSelectedGenre(savedGenre);
      if (savedSearchTerm) setSearchTerm(savedSearchTerm);
    }

    // Update session tracking
    const currentSessionId =
      session?.user?.email || session?.user?.id || "anonymous";
    const currentTime = new Date().toISOString();

    saveToLocalStorage("lastSessionId", currentSessionId);
    saveToLocalStorage("lastVisitTime", currentTime);

    setLastSessionId(currentSessionId);
    setLastVisitTime(currentTime);
  }, [session]);

  async function getAnime() {
    try {
      setAnime((prev) => ({ ...prev, loading: true }));

      const params = new URLSearchParams();
      if (selectedSeason) {
        setShowAllAnime(true);
        params.append("season", selectedSeason.toLowerCase());
      }
      if (selectedGenre) {
        setShowAllAnime(true);
        params.append("genre", selectedGenre);
      }
      if (selectedYear) {
        setShowAllAnime(true);
        params.append("year", selectedYear);
      }
      if (searchTerm) {
        setShowAllAnime(true);
        params.append("search", searchTerm);
      }

      const url = `/api/filter-anime${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch anime data");
      }
      const data = await response.json();
      setAnime({ error: false, loading: false, data: data.animeList });
    } catch (error) {
      console.error(error);
      setAnime({ error: true, loading: false, data: [] });
    }
  }

  function clearAll() {
    clearAllFilterState();
  }

  useEffect(() => {
    getSelectedAnime();
  }, [selectedAnimeType]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getAnime();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedSeason, selectedYear, selectedGenre]);

  const filterRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFilters = () => {
    if (filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-3 sm:mt-5 md:mt-8 flex flex-col items-center gap-3 sm:gap-5 md:gap-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mt-3 sm:mt-5 md:mt-8 text-center flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-5">
        <h1
          className={`text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl ${allerta.className}`}
        >
          Kickstart Your Anime Journey on AnimeVista
        </h1>
        <p
          className={`text-blue-100 ${allerta.className} leading-5 sm:leading-6 md:leading-7 lg:leading-8 font-medium text-base sm:text-lg md:text-xl`}
        >
          Track, share and discover <br className="hidden sm:block" /> your
          favorite anime among severals
        </p>
      </div>

      <SearchAnime />

      <section className="w-full max-w-5xl mt-5 sm:mt-8 md:mt-10 flex flex-col items-center gap-3 sm:gap-5 md:gap-8">
        <div className=" text-white self-start flex flex-col gap-2">
          <div className=" flex flex-row gap-2">
            <h1 className=" text-2xl font-bold self-center">Filter : </h1>
            <Select
              value={selectedAnimeType}
              onValueChange={setSelectedAnimeType}
              className=" outline-0 self-center"
            >
              <SelectTrigger className="w-[180px] border border-white/15 outline-0 cursor-pointer text-lg font-medium">
                <SelectValue placeholder="Filter anime" />
              </SelectTrigger>
              <SelectContent className=" p-1 bg-gray-900 outline-none border border-gray-700 rounded-md sm:text-base md:text-lg text-gray-300">
                <SelectItem
                  className={
                    " text-lg font-medium cursor-pointer bg-transparent"
                  }
                  value="recent"
                >
                  recent
                </SelectItem>
                <SelectItem
                  className={
                    " text-lg font-medium cursor-pointer bg-transparent"
                  }
                  value="popular"
                >
                  popular
                </SelectItem>
                <SelectItem
                  className={
                    " text-lg font-medium cursor-pointer bg-transparent"
                  }
                  value="upcoming"
                >
                  upcoming
                </SelectItem>
                <SelectItem
                  className={
                    " text-lg font-medium cursor-pointer bg-transparent"
                  }
                  value="top"
                >
                  top
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className=" w-[35%] border border-transparent py-1 rounded-full bg-blue-900" />
        </div>

        <div className="flex flex-col w-full gap-3 sm:gap-4 md:gap-5">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-gray-300 uppercase font-bold text-base sm:text-lg md:text-xl">
              {selectedAnimeType === "popular"
                ? "all time popular"
                : selectedAnimeType}
            </h1>
            <Link
              className="text-gray-200 font-medium text-sm sm:text-base hover:text-gray-400 transition-colors duration-200"
              href={animeTypeLink}
            >
              <div className=" flex flex-row gap-2 justify-center items-center">
                <MoveRight size={18} />
                <p>View All</p>
              </div>
            </Link>
          </div>
          {animeData.loading === true ? (
            <Loader />
          ) : animeData.error === true ? (
            <div className=" flex flex-col items-center gap-2">
              <p className="text-red-900 font-bold text-lg text-center">
                Try again...
              </p>
              <button
                className=" flex justify-center items-center gap-1 border border-gray-300 p-2 w-[100px] rounded-lg cursor-pointer text-white"
                onClick={refreshPage}
              >
                <RefreshCw color="#ffffff" strokeWidth={1.75} />
                <p className=" text-sm">Refresh</p>
              </button>
            </div>
          ) : (
            animeData && (
              <div className="flex flex-row gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 sm:overflow-x-visible">
                {animeData.data
                  .filter(
                    (anime, index, self) =>
                      index === self.findIndex((a) => a.mal_id === anime.mal_id)
                  )
                  .slice(0, 5)
                  ?.map((anime) => (
                    <Link
                      key={nanoid(10)}
                      href={`/anime/${anime.mal_id}`}
                      className="hover:opacity-90 transition-opacity duration-200"
                    >
                      <div className="flex flex-col gap-1.5 sm:gap-2">
                        <Image
                          src={
                            anime.images.jpg.large_image_url
                              ? anime.images.jpg.large_image_url
                              : anime.images.jpg.image_url
                          }
                          width={180}
                          height={200}
                          alt={anime.title}
                          className="rounded-lg bg-gray-900 border border-gray-700 object-cover"
                        />
                        <h2 className="text-gray-300 text-xs sm:text-sm font-medium w-[140px] sm:w-[160px] md:w-[180px] line-clamp-2">
                          {anime.title_english
                            ? anime.title_english
                            : anime.title}
                        </h2>
                      </div>
                    </Link>
                  ))}
              </div>
            )
          )}
        </div>
      </section>

      <div className="text-center mt-8 sm:mt-12 md:mt-16 space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          More than {NUMBER_ANIME} to dive into
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
      </div>

      <section
        id="genres"
        ref={filterRef}
        className="w-full max-w-5xl mt-2 flex flex-col gap-3 sm:gap-5 md:gap-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
            <label
              className="text-sm sm:text-base md:text-lg font-medium text-blue-100"
              htmlFor="search"
            >
              Search
            </label>
            <form
              onSubmit={(event) => event.preventDefault()}
              id="search"
              className="flex flex-row border px-1.5 sm:px-2 rounded-[5px] border-transparent bg-white/5 justify-center items-center gap-1.5 sm:gap-2"
              action=""
            >
              <Search size={16} color="#d6d6d6" strokeWidth={2.5} />
              <input
                className="outline-0 py-1.5 sm:py-2 font-medium text-xs sm:text-sm text-gray-300 w-full bg-transparent"
                type="text"
                placeholder="Search anime..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  saveToLocalStorage("searchTerm", e.target.value);
                }}
              />
              {searchTerm && (
                <button
                  className=" cursor-pointer text-white"
                  onClick={() => {
                    setSearchTerm("");
                    saveToLocalStorage("searchTerm", "");
                  }}
                >
                  <CircleX size={19} strokeWidth={1.75} />
                </button>
              )}
            </form>
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
            <label
              className="text-sm sm:text-base md:text-lg font-medium text-blue-100"
              htmlFor="genres"
            >
              Genres
            </label>
            <select
              onChange={(event) => {
                setSelectedGenre(event.target.value);
                saveToLocalStorage("genre", event.target.value);
              }}
              className="border-transparent w-full font-medium cursor-pointer outline-0 text-gray-300 p-1.5 sm:p-2 bg-white/5 text-xs sm:text-sm rounded-[5px] hover:bg-gray-700 transition-colors duration-200"
              name="anime-genres"
              id="genres"
              value={selectedGenre}
            >
              <option value="">Any</option>
              {genres &&
                genres.slice(0, 20).map((genre) => (
                  <option
                    className="cursor-pointer font-medium"
                    key={genre.mal_id}
                    value={genre.name}
                  >
                    {genre.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
            <label
              className="text-sm sm:text-base md:text-lg font-medium text-blue-100"
              htmlFor="years"
            >
              Years
            </label>
            <select
              onChange={(event) => {
                setSelectedYear(event.target.value);
                saveToLocalStorage("year", event.target.value);
              }}
              className="border-transparent w-full font-medium cursor-pointer outline-0 text-gray-300 p-1.5 sm:p-2 bg-white/5 text-xs sm:text-sm rounded-[5px] hover:bg-gray-700 transition-colors duration-200"
              name="anime-years"
              id="years"
              value={selectedYear}
            >
              <option value="">Any</option>
              {years &&
                years.map((year) => (
                  <option
                    className="cursor-pointer font-medium"
                    key={nanoid(10)}
                    value={year.year}
                  >
                    {year.year}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
            <label
              className="text-sm sm:text-base md:text-lg font-medium text-blue-100"
              htmlFor="seasons"
            >
              Seasons
            </label>
            <select
              onChange={(event) => {
                setSelectedSeason(event.target.value);
                saveToLocalStorage("season", event.target.value);
              }}
              className="border-transparent w-full font-medium cursor-pointer outline-0 text-gray-300 p-1.5 sm:p-2 bg-white/5 text-xs sm:text-sm rounded-[5px] hover:bg-gray-700 transition-colors duration-200"
              name="anime-seasons"
              id="seasons"
              value={selectedSeason}
            >
              <option value="">Any</option>

              {seasons.map((season) => (
                <option
                  className="cursor-pointer font-medium"
                  key={nanoid(10)}
                  value={season}
                >
                  {season}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedSeason || selectedGenre || selectedYear || searchTerm ? (
          <div className=" text-sm font-semibold flex flex-row gap-10">
            <div className=" flex text-white text-base flex-row gap-2">
              {selectedSeason && (
                <div className=" border border-transparent bg-blue-400 rounded-sm px-2 py-1 flex flex-row justify-center items-center gap-1">
                  <p className="">{selectedSeason}</p>
                  <button
                    onClick={() => {
                      setSelectedSeason("");
                      setShowAllAnime(false);
                      saveToLocalStorage("season", "");
                    }}
                    className=" cursor-pointer text-xl "
                  >
                    <CircleX size={22} strokeWidth={1.75} />
                  </button>
                </div>
              )}
              {selectedGenre && (
                <div className=" border border-transparent bg-blue-400 rounded-sm px-2 py-1 flex flex-row justify-center items-center gap-1">
                  <p className="">{selectedGenre}</p>
                  <button
                    onClick={() => {
                      setSelectedGenre("");
                      setShowAllAnime(false);
                      saveToLocalStorage("genre", "");
                    }}
                    className=" cursor-pointer text-xl "
                  >
                    <CircleX size={22} strokeWidth={1.75} />
                  </button>
                </div>
              )}
              {selectedYear && (
                <div className=" border border-transparent bg-blue-400 rounded-sm px-2 py-1 flex flex-row justify-center items-center gap-1">
                  <p className="">{selectedYear}</p>
                  <button
                    onClick={() => {
                      setSelectedYear("");
                      setShowAllAnime(false);
                      saveToLocalStorage("year", "");
                    }}
                    className=" cursor-pointer text-xl "
                  >
                    <CircleX size={22} strokeWidth={1.75} />
                  </button>
                </div>
              )}
              {searchTerm && (
                <div className=" border border-transparent bg-blue-400 rounded-sm px-2 py-1 flex flex-row justify-center items-center gap-1">
                  <p className="">{searchTerm}</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setShowAllAnime(false);
                      saveToLocalStorage("searchTerm", "");
                    }}
                    className=" cursor-pointer text-xl "
                  >
                    <CircleX size={22} strokeWidth={1.75} />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={clearAll}
              className="border border-transparent rounded-sm px-2 py-1 cursor-pointer bg-gray-400 text-white"
            >
              Clear All
            </button>
          </div>
        ) : (
          ""
        )}

        {anime.error ? (
          <p className="text-center text-red-500">Try again...</p>
        ) : anime.loading ? (
          <Loader />
        ) : !anime.data ? null : anime.data.length === 0 ? (
          <p className="text-center text-white">No anime found...</p>
        ) : (
          <div className="w-full mt-5 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {(showAllAnime ? anime.data : anime.data.slice(0, 400))
              .filter((a) => a && a.animeId && a.animeImage && a.animeName)
              .map((a) => (
                <div key={a.animeId}>
                  <AnimeBox
                    animeId={a.animeId}
                    animeImage={a.animeImage}
                    animeName={a.animeName}
                    year={a.year}
                    season={a.season}
                    genres={
                      Array.isArray(a.genres)
                        ? a.genres.map((g) =>
                            typeof g === "object" && g !== null ? g.name : g
                          )
                        : []
                    }
                  />
                </div>
              ))}
          </div>
        )}
      </section>
      {showScrollTop && (
        <button
          onClick={scrollToFilters}
          className="fixed bottom-8 border border-gray-600 left-8 z-50 cursor-pointer bg-gray-800 hover:translate-y-[-10px] duration-200 text-white rounded-full p-3 shadow-lg flex items-center gap-2 animate-fade-in"
          aria-label="Back to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
          <span className="hidden sm:inline font-medium">Top</span>
        </button>
      )}
    </div>
  );
};

export default Home;
