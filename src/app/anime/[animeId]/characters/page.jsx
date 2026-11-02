"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";

export default function CharactersPage({ params }) {
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;

  const [state, setState] = useState({
    data: [],
    loading: true,
    error: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function getCharacters() {
      try {
        const response = await fetch(`/api/anime/${animeId}/characters`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch characters: ${response.status}`);
        }
        const data = await response.json();
        setState({ data: data.characters ?? [], loading: false, error: false });
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error.message);
        setState({ data: [], loading: false, error: true });
      }
    }

    getCharacters();
    return () => controller.abort();
  }, [animeId]);

  return (
    <div className="text-white flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Characters{!state.loading && ` (${state.data.length})`}
        </h1>

        {state.loading && <p className="text-zinc-400">Loading characters...</p>}
        {state.error && (
          <p className="text-red-400">
            Failed to load characters. Please try again later.
          </p>
        )}
        {!state.loading && !state.error && state.data.length === 0 && (
          <p className="text-zinc-400">No characters found.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {state.data.map(({ node, role }) => {
            const name = `${node.first_name} ${node.last_name}`.trim();
            return (
              <div
                key={node.id}
                className="flex flex-col gap-2 bg-zinc-900/10 backdrop-blur-sm border border-white/10 rounded-lg p-2"
              >
                {node.main_picture?.medium && (
                  <Image
                    src={node.main_picture.medium}
                    alt={name}
                    width={225}
                    height={320}
                    className="w-full h-auto object-cover rounded-md"
                  />
                )}
                <h2 className="text-sm font-semibold">{name}</h2>
                {node.alternative_name && (
                  <p className="text-xs text-zinc-500">{node.alternative_name}</p>
                )}
                <p className="text-xs text-zinc-400">{role}</p>
                <p className="text-xs text-zinc-500">
                  ♥ {(node.num_favorites ?? 0).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}