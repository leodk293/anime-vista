"use client";
import React, { useState, useEffect } from "react";

export default function CharacterSection({ animeId }) {
  const [animeCharacters, setAnimeCharacters] = useState([]);
  async function fetchAnimeCharacters() {
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/characters`
      );
      if (!response.ok) {
        throw new Error(`An error has occurred : ${response.text}`);
      }
      const result = await response.json();
      setAnimeCharacters(result.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(()=>{
    fetchAnimeCharacters();
  },[animeId])
  return <div>CharacterSection</div>;
}
