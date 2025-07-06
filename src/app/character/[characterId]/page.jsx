"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import Image from "next/image";
import Loader from "../../../../components/loader/Loader";

export default function CharacterPage({ params }) {
  const resolvedParams = use(params);
  const { characterId } = resolvedParams;

  const [animePoster, setAnimePoster] = useState(null)

  async function getAnimePoster(){

  }

  if (!animeId) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-xl text-red-500">Invalid anime ID provided.</h1>
      </div>
    );
  }
  return (
    <div className="  min-h-screen text-white">
        {characterId}

    </div>
  )
}
