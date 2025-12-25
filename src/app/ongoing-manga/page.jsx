"use client";
import React from "react";
import MangaCategory from "../../../components/MangaCategory";

export default function Page() {
   return (
    <MangaCategory
      category={"Still ongoing"}
      api={"https://api.jikan.moe/v4/top/manga?filter=publishing"}
    />
  );
}
