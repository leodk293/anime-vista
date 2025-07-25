"use client";
import React, { useState, useEffect, use, useCallback, useMemo } from "react";
import Link from "next/link";
import Loader from "../../../../../components/loader/Loader";

const API_BASE_URL = "https://api.jikan.moe/v4";


const useEpisodeList = (animeId) => {
  const [state, setState] = useState({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchEpisodes = useCallback(async () => {
    if (!animeId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}/anime/${animeId}/episodes`);

      if (!response.ok) {
        throw new Error(`Failed to fetch episodes: ${response.status}`);
      }

      const result = await response.json();
      setState({
        data: result.data || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Episode fetch error:", error.message);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, [animeId]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  return { ...state, refetch: fetchEpisodes };
};


const getEpisodeTitle = (episode) => {
  return (
    episode.title ||
    episode.title_japanese ||
    episode.title_romanji ||
    "No title available"
  );
};

const EpisodeItem = React.memo(({ episode, index, animeId }) => (
  <Link
    href={`/anime/${animeId}/watch/${index + 1}/episode`}
    className="block border-b border-gray-100 rounded-t-sm p-2 hover:bg-white/10 transition-colors duration-200"
  >
    <div className="flex justify-between items-center md:text-[15px]">
      <span className="font-medium">Episode {index + 1}</span>
      <span className="text-gray-300 truncate ml-4">
        {getEpisodeTitle(episode)}
      </span>
    </div>
  </Link>
));

EpisodeItem.displayName = "EpisodeItem";


const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <h1 className="text-xl text-red-500">Something went wrong, try again</h1>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);

const EmptyState = () => (
  <p className="mt-5 text-center text-gray-200">
    Episodes not available yet...
  </p>
);


const EpisodeListHeader = ({ episodeCount }) => (
  <div className="flex flex-col gap-2">
    <h1 className="text-xl font-bold text-white">
      Episode List ({episodeCount})
    </h1>
    <div className="w-[10%] border border-transparent py-1 rounded-full bg-blue-900" />
  </div>
);


export default function WatchPage({ params }) {
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;

  const { data: episodes, isLoading, error, refetch } = useEpisodeList(animeId);

  // Memoize episode count to prevent unnecessary re-renders
  const episodeCount = useMemo(() => episodes?.length || 0, [episodes]);

  
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  if (episodeCount === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-10 text-white">
      <EpisodeListHeader episodeCount={episodeCount} />

      <div className="flex flex-col gap-1">
        {episodes.map((episode, index) => (
          <EpisodeItem
            key={`episode-${episode.mal_id || index}`}
            episode={episode}
            index={index}
            animeId={animeId}
          />
        ))}
      </div>
    </div>
  );
}
