import React from "react";
import Link from "next/link";
import { Permanent_Marker } from "next/font/google";

const permanent_maker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
});

export default function Logo({mobileSize, LaptopSize}) {
  return (
    <Link className=" self-center" href={"/"}>
      <h1
        className={` ${permanent_maker.className} ${mobileSize} font-bold text-white md:${LaptopSize}`}
      >
        Anime<span className=" text-blue-700">Vista</span>🍥
      </h1>
    </Link>
  );
}
