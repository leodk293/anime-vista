"use client";
import React from "react";
import MangaCategory from "../../../components/MangaCategory";

export default function PopularManga() {
  return (
    <MangaCategory
      category={"The Most popular"}
      api={"https://api.jikan.moe/v4/top/manga?filter=bypopularity"}
    />
  );
}
