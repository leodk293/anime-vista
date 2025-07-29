import React from "react";
import Link from "next/link";
import { Permanent_Marker } from "next/font/google";

const permanent_maker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
});

export default function Logo() {
  return (
    <Link className=" self-center" href={"/"}>
      <h1
        className={` ${permanent_maker.className} text-3xl font-bold text-white md:text-4xl`}
      >
        Anime<span className=" text-blue-700">Vista</span>🍥
      </h1>
    </Link>
  );
}
