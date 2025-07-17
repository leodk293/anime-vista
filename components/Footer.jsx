import React from "react";
import Link from "next/link";
import Logo from "./logo/Logo";
import {
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  //Discord,
  Github,
} from "lucide-react";

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
          <p className="text-sm text-gray-400">
            Your gateway to anime discovery
          </p>
        </div>

        {/* Quick Links */}
        <div className=" flex flex-col gap-3">
          <h1 className=" font-bold text-2xl">Quick Links</h1>
          <div className=" flex flex-col gap-2">
            <Link
              className="pt-2 hover:text-blue-400 transition-colors"
              href="/trending"
            >
              Trending Anime
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/top-rated"
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
              href="/genres"
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

        {/* Support */}
        <div className=" flex flex-col gap-3">
          <h1 className=" font-bold text-2xl">Support</h1>
          <div className=" flex flex-col gap-2">
            <Link
              className="pt-2 hover:text-blue-400 transition-colors"
              href="/contact"
            >
              Contact Us
            </Link>
            <Link className="hover:text-blue-400 transition-colors" href="/faq">
              FAQ
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/help"
            >
              Help Center
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/report"
            >
              Report Issue
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="mailto:aboubatraore04@gmail.com"
            >
              aboubatraore04@gmail.com
            </Link>
          </div>
        </div>

        {/* Legal */}
        <div className=" flex flex-col gap-3">
          <h1 className=" font-bold text-2xl">Legal</h1>
          <div className=" flex flex-col gap-2">
            <Link
              className="pt-2 hover:text-blue-400 transition-colors"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/terms"
            >
              Terms of Service
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/cookies"
            >
              Cookie Policy
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/dmca"
            >
              DMCA
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              href="/disclaimer"
            >
              Disclaimer
            </Link>
          </div>
        </div>

        {/* Social Media */}
        <div className=" flex flex-col gap-3">
          <h1 className=" font-bold text-2xl">Connect with us</h1>
          <div className=" flex flex-row gap-3 flex-wrap">
            <Link
              className=" border border-transparent rounded-full p-2 bg-red-600 hover:bg-red-700 transition-colors"
              href=""
              aria-label="YouTube"
            >
              <Youtube size={25} color="#ffffff" strokeWidth={1.75} />
            </Link>
            <Link
              className=" border border-transparent rounded-full p-2 bg-blue-600 hover:bg-blue-700 transition-colors"
              href=""
              aria-label="Twitter"
            >
              <Twitter size={25} color="#ffffff" strokeWidth={1.75} />
            </Link>
            <Link
              className=" border border-transparent rounded-full p-2 bg-blue-800 hover:bg-blue-900 transition-colors"
              href=""
              aria-label="Facebook"
            >
              <Facebook size={25} color="#ffffff" strokeWidth={1.75} />
            </Link>
            <Link
              className=" border border-transparent rounded-full p-2 bg-pink-800 hover:bg-pink-700 transition-colors"
              href=""
              aria-label="Instagram"
            >
              <Instagram size={25} color="#ffffff" strokeWidth={1.75} />
            </Link>
            {/* <Link
              className=" border border-transparent rounded-full p-2 bg-indigo-600 hover:bg-indigo-700 transition-colors"
              href=""
              aria-label="Discord"
            >
              <Discord size={25} color="#ffffff" strokeWidth={1.75} />
            </Link> */}
            <Link
              className=" border border-gray-500 rounded-full p-2 bg-gray-800 hover:bg-gray-900 transition-colors"
              href=""
              aria-label="GitHub"
            >
              <Github size={25} color="#ffffff" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
