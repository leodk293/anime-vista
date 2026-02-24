import React from "react";

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/characters/${params.characterId}/full`);
    if (!res.ok) return {
      title: "Character",
    };
    const result = await res.json();
    return {
      title: result?.data?.name ?? "Character",
      description: result?.data?.about ?? "",
    };
  } catch {
    return {};
  }
}

export default function layout({ children }) {
  return <>{children}</>;
}
