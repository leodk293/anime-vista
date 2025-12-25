"use client";
import React, { useState } from "react";
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
  Menu,
  X,
  Rocket,
  BookOpen,
} from "lucide-react";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import SearchAnime from "./SearchAnime";

import { Skeleton } from "@/components/ui/skeleton";

export default function Header() {
  const { status, data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/recent-anime", label: "Trending", icon: TrendingUp },
    { href: "/top-anime", label: "Top Rated", icon: Star },
    { href: "/upcoming-anime", label: "Upcoming", icon: Rocket },
    { href: "/popular-anime", label: "Popular", icon: Heart },
    { href: "/manga", label: "Manga", icon: BookOpen },
    { href: "/Watchlist", label: "Watchlist", icon: Bookmark },
    { href: "/contact", label: "contact", icon: PhoneCall },
    {
      href: "https://anime-vista-api-showcase.vercel.app",
      label: "API",
      icon: Code,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-b-gray-400/10 w-full">
      <header className="flex flex-col mx-auto py-5 max-w-5xl gap-4">
        <div className="flex flex-wrap justify-center gap-5 md:justify-between md:gap-0">
          <Logo mobileSize={"text-3xl"} LaptopSize={"text-4xl"} />

          <div className="hidden sm:flex self-center text-sm lg:text-base text-gray-300 font-medium gap-3 lg:gap-5">
            <Link
              target="_blank"
              className="hover:text-white duration-200 whitespace-nowrap"
              href={"https://www.youtube.com/@aboubacartraore5831"}
            >
              Youtube
            </Link>
            <Link
              className="hover:text-white duration-200 whitespace-nowrap"
              href="https://x.com/Aboubac48530295"
              aria-label="Twitter"
              target="_blank"
            >
              X/Twitter
            </Link>
            <Link
              className="hover:text-white duration-200 whitespace-nowrap"
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
                    title={session?.user?.name}
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex mt-3 w-full self-center border border-transparent bg-white/5 px-5 py-2 rounded-full flex-wrap justify-center gap-2 md:gap-4">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.label === "API" ? "_blank" : ""}
                className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 text-sm font-medium"
              >
                <IconComponent size={18} strokeWidth={1.5} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex justify-center">
          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center w-10 h-10 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} strokeWidth={1.5} />
            ) : (
              <Menu size={24} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {/* {isMobileMenuOpen && (
          <nav className="md:hidden mt-2 w-full bg-white/5 rounded-2xl border border-gray-300/10 backdrop-blur-sm">
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.label === "API" ? "_blank" : ""}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-base font-medium"
                  >
                    <IconComponent size={20} strokeWidth={1.5} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )} */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-2 w-full bg-white/5 rounded-2xl border border-gray-300/10 backdrop-blur-sm overflow-hidden">
            <div className="flex flex-col p-3 sm:p-4 space-y-1 sm:space-y-2 max-h-[60vh] overflow-y-auto">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.label === "API" ? "_blank" : ""}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm sm:text-base font-medium"
                  >
                    <IconComponent
                      size={18}
                      strokeWidth={1.5}
                      className="sm:w-5 sm:h-5"
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Social Links */}
              <div className="pt-3 mt-2 border-t border-gray-300/10 flex flex-col space-y-1">
                <Link
                  target="_blank"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm sm:text-base font-medium"
                  href={"https://www.youtube.com/@aboubacartraore5831"}
                >
                  <span>Youtube</span>
                </Link>
                <Link
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm sm:text-base font-medium"
                  href="https://x.com/Aboubac48530295"
                  target="_blank"
                >
                  <span>X/Twitter</span>
                </Link>
                <Link
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm sm:text-base font-medium"
                  href="https://github.com/leodk293"
                  target="_blank"
                >
                  <span>Github</span>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
    </div>
  );
}
