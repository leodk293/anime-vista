import React from "react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link className=" self-center" href={"/"}>
      <h1 className=" text-3xl font-bold text-white">
        Anime<span className=" text-blue-900">Vista</span>
      </h1>
    </Link>
  );
}
