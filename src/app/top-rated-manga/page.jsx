"use client";
import React from "react";
import MangaCategory from "../../../components/MangaCategory";

export default function TopRatedManga() {
  return (
    <MangaCategory
      category={"The Top rated"}
      api={"https://api.jikan.moe/v4/top/manga"}
    />
  );
}
