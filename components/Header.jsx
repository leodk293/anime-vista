"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./logo/Logo";
import { useSession } from "next-auth/react";
import {
  TrendingUp,
  Star,
  Heart,
  Code,
  Bookmark,
  PhoneCall,
} from "lucide-react";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

import { Skeleton } from "@/components/ui/skeleton";

export default function Header() {
  const { status, data: session } = useSession();

  const navLinks = [
    { href: "/recent-anime", label: "Trending", icon: TrendingUp },
    { href: "/top-anime", label: "Top Rated", icon: Star },
    { href: "/popular-anime", label: "Popular", icon: Heart },
    { href: "/Watchlist", label: "Watchlist", icon: Bookmark },
    { href: "/contact", label: "contact", icon: PhoneCall },
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
          <Logo mobileSize={"text-3xl"} LaptopSize={"text-4xl"} />

          <div className=" text-lg text-gray-300 font-medium self-center flex flex-row gap-5">
            <Link
              target="_blank"
              className=" self-center hover:text-white duration-200"
              href={"https://www.reddit.com/user/ElectricalHurry5975/"}
            >
              Reddit
            </Link>
            <Link
              className=" self-center hover:text-white duration-200"
              href="https://x.com/Aboubac48530295"
              aria-label="Twitter"
              target="_blank"
            >
              X/Twitter
            </Link>
            <Link
              className=" self-center hover:text-white duration-200"
              href="https://github.com/leodk293"
              aria-label="GitHub"
              target="_blank"
            >
              Github
            </Link>
          </div>

          {status === "unauthenticated" ? (
            <LoginButton />
          ) : status === "loading" ? (
            <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-full border border-gray-300/10 min-w-[160px] animate-pulse">
              <Skeleton className="h-8 w-8 rounded-full bg-gray-300/30" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-3 w-20 rounded bg-gray-300/30" />
                <Skeleton className="h-2 w-14 rounded bg-gray-300/20" />
              </div>
            </div>
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

              <LogoutButton />
            </div>
          )}
        </div>

        <nav className=" mt-3 w-[75%] self-center border border-transparent bg-white/5 px-5 py-2 rounded-full flex flex-wrap justify-center gap-2 md:gap-4">
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
