"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RecommendationsPage({ params }) {
  const resolvedParams = use(params);
  const animeId = resolvedParams.animeId;

  const [state, setState] = useState({
    data: [],
    loading: true,
    error: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function getRecommendations() {
      try {
        const response = await fetch(`/api/anime/${animeId}/recommendations`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.status}`);
        }
        const data = await response.json();
        setState({
          data: data.recommendations ?? [],
          loading: false,
          error: false,
        });
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error.message);
        setState({ data: [], loading: false, error: true });
      }
    }

    getRecommendations();
    return () => controller.abort();
  }, [animeId]);

  return (
    <div className="text-white flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">Recommendations</h1>

        {state.loading && (
          <p className="text-zinc-400">Loading recommendations...</p>
        )}
        {state.error && (
          <p className="text-red-400">
            Failed to load recommendations. Please try again later.
          </p>
        )}
        {!state.loading && !state.error && state.data.length === 0 && (
          <p className="text-zinc-400">No recommendations found.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {state.data.map(({ node, num_recommendations }) => (
            <div
              key={node.id}
              className="bg-zinc-900/10 backdrop-blur-sm border border-white/10 rounded-lg p-2"
            >
              <Link href={`/anime/${node.id}`}>
                <Image
                  src={node.main_picture?.medium ?? "/placeholder.png"}
                  alt={node.title}
                  width={225}
                  height={320}
                  className="w-full h-auto object-cover rounded-md"
                />
              </Link>
              <h2 className="text-sm font-semibold mt-2">{node.title}</h2>
              {num_recommendations > 0 && (
                <p className="text-xs text-zinc-400">
                  {num_recommendations} recommendation
                  {num_recommendations > 1 ? "s" : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}