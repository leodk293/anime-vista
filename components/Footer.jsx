import React from "react";
import Link from "next/link";
import Logo from "./logo/Logo";
import Medias from "./Medias";
import SearchAnime from "./SearchAnime";

export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className=" mt-[5rem] bg-black/10 border-t border-t-gray-400/10 w-full">
      <footer className=" text-white flex flex-wrap mx-auto max-w-6xl justify-start gap-5 px-3 py-10 md:justify-between md:gap-0 md:px-0 ">
        <div className=" flex flex-col items-start gap-2">
          <div>
            <Logo />
          </div>
          <p>© {year} AnimeVista. All rights reserved.</p>
          <p className="text-sm text-gray-200">
            Your gateway to anime discovery
          </p>
        </div>

        <div className=" flex flex-col gap-3">
          <h1 className=" font-bold text-2xl">Quick Links</h1>
          <div className=" flex flex-col gap-2">
            <Link
              className="pt-2 hover:text-blue-400 transition-colors"
              href="/recent-anime"
            >
              Trending Anime
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/top-anime"
            >
              Top Rated
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/new-releases"
            >
              New Releases
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/#genres"
            >
              Browse Genres
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/Watchlist"
            >
              My Watchlist
            </Link>
          </div>
        </div>

        <div className=" flex flex-col gap-3">
          <h1 className=" font-bold text-2xl">Support</h1>
          <div className=" flex flex-col gap-2">
            <Link
              className="pt-2 hover:text-blue-400 transition-colors"
              href="/contact"
            >
              Contact Us
            </Link>
            <Link className="hover:text-blue-400 transition-colors" href="/FAQ">
              FAQ
            </Link>

            <Link target="_blank" className="hover:text-blue-400 transition-colors" href="https://anime-vista-api-showcase.vercel.app">
              API
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="mailto:atnumberone61@gmail.com"
            >
              atnumberone61@gmail.com
            </Link>
          </div>
        </div>

        <div className=" flex flex-col gap-3">
          <h1 className=" font-bold text-2xl">Connect with us</h1>
          <Medias />
          <span className=" mt-4">
            <SearchAnime />
          </span>
        </div>
      </footer>
    </div>
  );
}
