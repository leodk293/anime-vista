"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import googleLogo from "../public/google-logo.png";
import Logo from "./logo/Logo";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  LogOut,
  TrendingUp,
  Star,
  Heart,
  Code,
  Bookmark,
  Github,
  Twitter,
} from "lucide-react";
import Reddit from "../public/reddit-icon.png";

export default function Header() {
  const { status, data: session } = useSession();

  const navLinks = [
    { href: "/recent-anime", label: "Trending", icon: TrendingUp },
    { href: "/top-anime", label: "Top Rated", icon: Star },
    { href: "/popular-anime", label: "Popular", icon: Heart },
    { href: "/Watchlist", label: "Watchlist", icon: Bookmark },
    {
      href: "https://anime-vista-api-showcase.vercel.app",
      label: "API",
      icon: Code,
    },
  ];

  return (
    <div className="bg-black/10 border-b border-b-gray-400/10 w-full">
      <header className="flex flex-col mx-auto py-5 max-w-5xl gap-4">
        <div className="flex flex-wrap justify-center gap-5 md:justify-between md:gap-0">
          <Logo />

          <div className=" text-lg text-gray-300 font-medium self-center flex flex-row gap-5">
            <Link
              target="_blank"
              className=" self-center"
              href={"https://www.reddit.com/user/ElectricalHurry5975/"}
            >
              Reddit
            </Link>
            <Link
              className=" self-center"
              href="https://x.com/Aboubac48530295"
              aria-label="Twitter"
              target="_blank"
            >
              X/Twitter
            </Link>
            <Link
              className=" self-center"
              href="https://github.com/leodk293"
              aria-label="GitHub"
              target="_blank"
            >
              Github
            </Link>
          </div>

          {status === "unauthenticated" ? (
            <button
              onClick={() => signIn("google")}
              className="border border-transparent text-lg bg-gray-100 rounded-full cursor-pointer px-4 py-2 self-center flex flex-row gap-1 justify-center items-center"
            >
              <Image
                src={googleLogo}
                alt="Google"
                width={25}
                height={25}
                className="self-center object-contain"
              />
              <span className="self-center font-medium">Login</span>
            </button>
          ) : status === "loading" ? (
            <span className="self-center flex flex-row items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-sm font-medium">Loading...</span>
            </span>
          ) : (
            <div className="flex flex-row gap-2">
              {session?.user && (
                <div className="border border-gray-300 rounded-full px-3 py-1 flex flex-row gap-2">
                  <Image
                    src={session?.user?.image}
                    alt={session?.user?.name}
                    width={30}
                    height={30}
                    className="self-center border border-gray-950/10 rounded-full object-cover"
                  />
                  <p className="text-white self-center">
                    {session?.user?.name?.split(" ")[0]}
                  </p>
                </div>
              )}

              <button
                onClick={() => signOut()}
                className="border border-transparent text-lg bg-white/10 text-white rounded-full cursor-pointer px-4 py-2 self-center flex flex-row gap-2 justify-center items-center hover:translate-x-2 duration-200"
              >
                <LogOut
                  className="self-center"
                  size={25}
                  color="#ffffff"
                  strokeWidth={1.75}
                />
                <p className="self-center">Log out</p>
              </button>
            </div>
          )}
        </div>

        {/* Navigation section */}
        <nav className=" mt-3 w-[70%] self-center border border-transparent bg-white/5 px-5 py-2 rounded-full flex flex-wrap justify-center gap-2 md:gap-4">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.label === "API" ? "_blank" : ""}
                className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 text-sm font-medium"
              >
                <IconComponent
                  className=" hidden md:block"
                  size={18}
                  strokeWidth={1.5}
                />
                <span className="">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>
    </div>
  );
}
