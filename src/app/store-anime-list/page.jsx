"use client";

import React, { useState, useEffect } from "react";

export default function AnimeList() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //https://api.jikan.moe/v4/anime?genres=41
  /*const animeName = "Edgerunners";
  async function getAnimeList() {
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${animeName}&order_by=popularity&sort=asc&sfw`
      );
      if (!response.ok) {
        throw new Error(response.message);
      }
      const data = await response.json();
      const animeTab = data.data;
      const animeIds = animeTab.flatMap((item) => item.mal_id);
      setAnimeList(animeIds);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }*/

    //recommended
  async function getAnimeList() {
    try {
      const response = await fetch(
        "https://api.jikan.moe/v4/recommendations/anime"
      );
      if (!response.ok) {
        throw new Error(response.message);
      }
      const data = await response.json();
      const animeEntries = data.data.flatMap((item) => item.entry);
      const animeIds = animeEntries.map((entry) => entry.mal_id);
      setAnimeList(animeIds);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function storeAnimeById(animeId) {
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/full`
      );
      if (!response.ok) {
        throw new Error(response.message);
      }
      const data = await response.json();

      const storeResponse = await fetch("/api/anime-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animeName: data.data.title_english
            ? data.data.title_english
            : data.data.title,
          animeImage: data.data.images.jpg.large_image_url,
          animeId: data.data.mal_id,
          genres: data.data.genres,
          year: data.data.aired.prop.from.year,
          season: data.data.season,
        }),
      });

      if (!storeResponse.ok) {
        const errorData = await storeResponse.json();
        throw new Error(errorData.error || "Failed to store anime");
      }

      const result = await storeResponse.json();
      console.log(`Stored anime: ${data.data.title_english}`);
    } catch (error) {
      console.error(`Error storing anime ${animeId}:`, error.message);
    }
  }

  useEffect(() => {
    getAnimeList();
  }, []);

  useEffect(() => {
    if (animeList.length > 0) {
      // Process anime list in batches to avoid overwhelming the API
      const processAnimeList = async () => {
        for (const animeId of animeList) {
          await storeAnimeById(animeId);
          // Add a small delay between requests to respect rate limits
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      };
      processAnimeList();
    }
  }, [animeList]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className=" text-white">AnimeList Storage {animeList.length}</div>
    </div>
  );
}
