import React from "react";
import Link from "next/link";
import Logo from "./logo/Logo";
import Medias from "./Medias";
import letters from "../utils/letters";

export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className=" mt-[5rem] pb-5 bg-black/10 border-t border-t-gray-400/10 w-full">
      <footer className=" text-white flex flex-wrap mx-auto max-w-6xl justify-start gap-5 px-3 py-10 md:justify-between md:gap-0 md:px-0 ">
        <div className=" flex flex-col items-start gap-2">
          <div>
            <Logo mobileSize={"text-3xl"} LaptopSize={"text-4xl"} />
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
              Watchlist
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

            <Link
              target="_blank"
              className="hover:text-blue-400 transition-colors"
              href="https://anime-vista-api-showcase.vercel.app"
            >
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
        </div>
      </footer>
      <div className="flex max-w-6xl w-full mx-auto flex-col gap-2">
        <h1 className="text-xl pl-1 self-start font-bold text-white">
          Browse by Letter
        </h1>

        <nav
          aria-label="Browse by letter"
          className="relative z-10 flex flex-wrap gap-2"
          //className="relative z-10 justify-center flex flex-nowrap overflow-x-auto md:flex-wrap md:overflow-visible gap-[9px] mb-10 pb-2 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {letters.map((letter) => (
            <Link
              key={letter}
              href={`/alphabetical/${letter}`}
              className={`
                inline-flex items-center justify-center min-w-[2.2rem] px-2 py-1.5
                text-base font-black tracking-wide rounded-sm border transition-all duration-150    
                "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white" 
              `}
            >
              {letter}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
