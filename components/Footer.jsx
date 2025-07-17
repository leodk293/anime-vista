import React from "react";
import Link from "next/link";
import Logo from "./logo/Logo";
import { Youtube, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className=" mt-[5rem] bg-black/10 border-t border-t-gray-400/10 w-full">
      <footer className=" text-white flex flex-wrap mx-auto max-w-5xl justify-start gap-5 px-3 py-10 md:justify-between md:gap-0 md:px-0 ">
        <div className=" flex flex-col items-start gap-2">
          <div>
            <Logo />
          </div>
          <p>© {year} AnimeVista. All rights reserved.</p>
        </div>

        <div className=" flex flex-col gap-3">
          <h1 className=" font-bold text-2xl">Support</h1>
          <div className=" flex flex-col gap-2">
            <Link className="pt-2" href={""}>
              Contact
            </Link>
            <Link href={""}>FAQ</Link>
            <Link href={""}>aboubatraore04@gmail.com</Link>
          </div>
        </div>

        <div className=" flex flex-col gap-3">
          <h1 className=" font-bold text-2xl">Connect with us</h1>
          <div className=" flex flex-row gap-3">
            <Link className=" border border-transparent rounded-full p-2 bg-red-600" href={""}>
              <Youtube size={25} color="#ffffff" strokeWidth={1.75} />
            </Link>
            <Link className=" border border-transparent rounded-full p-2 bg-blue-600" href={""}>
              <Twitter size={25} color="#ffffff" strokeWidth={1.75} />
            </Link>
            <Link className=" border border-transparent rounded-full p-2 bg-blue-800" href={""}>
              <Facebook size={25} color="#ffffff" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
