"use client";
import React from "react";
import { use } from "react";
import MangaCharacters from "../../../../../components/MangaCharacters";

export default function Characters({ params }) {
  const resolvedParams = use(params);
  const mangaId = resolvedParams.mangaId;

  return <MangaCharacters mangaId={mangaId} length={0} />;
}
