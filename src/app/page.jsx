"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Search,
  CircleX,
  MoveRight,
  RefreshCw,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import Link from "next/link";
import Image from "next/image";
import AnimeBox from "../../components/AnimeBox";
import Loader from "../../components/loader/Loader";
import { useRouter } from "next/navigation";

const Home = () => {
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const router = useRouter();

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
  /*useEffect(() => {
    getAnimeGenres();
    getAnimeYears();
  }, []);*/
  const seasons = ["Spring", "Fall", "Winter", "Summer"];
  const types = ["recent", "popular", "upcoming", "top"];
  const { status, data: session } = useSession();

  const [animeData, setAnimeData] = useState({
    error: false,
    loading: false,
    data: [],
  });
  const [selectedAnimeType, setSelectedAnimeType] = useState("Recent");
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

  async function getAnime() {
    try {
      setAnime((prev) => ({ ...prev, loading: true }));

      const params = new URLSearchParams();
      if (selectedSeason) params.append("season", selectedSeason.toLowerCase());
      if (selectedGenre) params.append("genre", selectedGenre);
      if (selectedYear) params.append("year", selectedYear);
      if (searchTerm) params.append("search", searchTerm);

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
    setSelectedSeason("");
    setSelectedYear("");
    setSelectedGenre("");
    setSearchTerm("");
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

  return (
    <div className="mt-3 sm:mt-5 md:mt-8 flex flex-col items-center gap-3 sm:gap-5 md:gap-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mt-3 sm:mt-5 md:mt-8 text-center flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-5">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
          The next generation anime platform
        </h1>
        <p className="text-blue-200 leading-5 sm:leading-6 md:leading-7 lg:leading-8 font-medium text-base sm:text-lg md:text-xl">
          Track, share and discover <br className="hidden sm:block" /> your
          favorite anime among severals
        </p>
      </div>

      <form className=" flex flex-row" action="">
        <input
          className=" text-gray-100 font-medium px-4 py-2 self-center border border-gray-500 border-r-transparent rounded-tl-lg outline-none rounded-bl-lg text-lg"
          placeholder="Search for an anime..."
          type="text"
        />
        <button className=" cursor-pointer px-4 py-2 border border-gray-500 bg-blue-950 self-center rounded-tr-lg rounded-br-lg text-lg">
          <Search size={28} color="#ffffff" strokeWidth={1.75} />
        </button>
      </form>

      {status === "unauthenticated" ? (
        <div className=" text-white flex flex-col items-center gap-2">
          <p className="font-medium italic text-gray-300">
            Login and make your favorite AnimeList
          </p>
          <button
            onClick={() => signIn("google")}
            className="text-sm sm:text-base md:text-lg font-medium rounded-full flex flex-row px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-3 justify-center items-center cursor-pointer gap-2 sm:gap-3 md:gap-4 bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          >
            <p className="text-white capitalize">Login</p>
            <ChevronRight
              className="border border-transparent text-blue-500 bg-white rounded-full p-0.5 sm:p-1"
              size={24}
              strokeWidth={1.75}
            />
          </button>
        </div>
      ) : (
        <Link
          href={"/favorite-animeList"}
          className=" border border-gray-200 bg-transparent px-5 py-3 rounded-full text-lg text-white hover:translate-x-3 duration-200"
        >
          Favorite AnimeList ➡️
        </Link>
      )}

      <section className="w-full max-w-5xl mt-5 sm:mt-8 md:mt-10 flex flex-col items-center gap-3 sm:gap-5 md:gap-8">
        <h1 className="text-gray-300 self-start uppercase font-bold text-base sm:text-lg md:text-xl">
          Filter :{" "}
          <select
            onChange={(e) => setSelectedAnimeType(e.target.value)}
            className=" cursor-pointer bg-gray-900 outline-none border border-gray-700 rounded-md text-sm sm:text-base md:text-lg text-gray-300 p-1 sm:p-2 md:p-3"
          >
            <option value="recent">recent</option>
            <option value="popular">popular</option>
            <option value="upcoming">upcoming</option>
            <option value="top">top</option>
          </select>
        </h1>

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
                          className="rounded-lg border border-gray-700 object-cover"
                        />
                        <h2 className="text-gray-300 text-xs sm:text-sm font-medium w-[140px] sm:w-[160px] md:w-[180px] line-clamp-2">
                          {anime.title_english
                            ? anime.title_english
                            : anime.title}
                        </h2>
                      </div>
                    </Link>
                    // <AnimeBox
                    //   animeId={anime.mal_id}
                    //   animeImage={
                    //     anime.images.jpg.large_image_url
                    //       ? anime.images.jpg.large_image_url
                    //       : anime.images.jpg.image_url
                    //   }
                    //   animeName={
                    //     anime.title_english ? anime.title_english : anime.title
                    //   }
                    // />
                  ))}
              </div>
            )
          )}
        </div>
      </section>

      <section className="w-full max-w-5xl mt-5 sm:mt-8 md:mt-10 flex flex-col gap-3 sm:gap-5 md:gap-8">
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className=" cursor-pointer text-white"
                  onClick={() => setSearchTerm("")}
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
              onChange={(event) => setSelectedGenre(event.target.value)}
              className="border-transparent w-full font-medium cursor-pointer outline-0 text-gray-300 p-1.5 sm:p-2 bg-white/5 text-xs sm:text-sm rounded-[5px] hover:bg-gray-700 transition-colors duration-200"
              name="anime-genres"
              id="genres"
            >
              <option value="">Any</option>
              {genres &&
                genres.map((genre) => (
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
              onChange={(event) => setSelectedYear(event.target.value)}
              className="border-transparent w-full font-medium cursor-pointer outline-0 text-gray-300 p-1.5 sm:p-2 bg-white/5 text-xs sm:text-sm rounded-[5px] hover:bg-gray-700 transition-colors duration-200"
              name="anime-years"
              id="years"
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
              onChange={(event) => setSelectedSeason(event.target.value)}
              className="border-transparent w-full font-medium cursor-pointer outline-0 text-gray-300 p-1.5 sm:p-2 bg-white/5 text-xs sm:text-sm rounded-[5px] hover:bg-gray-700 transition-colors duration-200"
              name="anime-seasons"
              id="seasons"
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
                    onClick={() => setSelectedSeason("")}
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
                    onClick={() => setSelectedGenre("")}
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
                    onClick={() => setSelectedYear("")}
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
                    onClick={() => setSearchTerm("")}
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

        {anime.error === true ? (
          <p className="text-center text-red-500">Try again...</p>
        ) : anime.loading === true ? (
          <Loader />
        ) : (
          anime.data &&
          (anime.data.length === 0 ? (
            <p className=" text-center text-white">No anime found...</p>
          ) : (
            <div className="w-full mt-5 self-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {anime.data
                .filter(
                  (anime) =>
                    anime &&
                    anime.animeId &&
                    anime.animeImage &&
                    anime.animeName
                )
                .map((anime) => (
                  <div key={anime.animeId}>
                    <AnimeBox
                      animeId={anime.animeId}
                      animeImage={anime.animeImage}
                      animeName={anime.animeName}
                    />
                  </div>
                ))}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Home;
