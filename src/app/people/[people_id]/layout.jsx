import React from "react";

export async function generateMetadata({ params }, parent) {
  const id = params.people_id;

  const res = await fetch(`https://api.jikan.moe/v4/people/${id}/full`);
  if (!res.ok)
    return {
      title: "People",
    };
  const result = await res.json();

  if (result) {
    return {
      title: `${result?.data?.name}`,
      description: `${result?.data?.about}`,
    };
  }
}

export default function layout({ children }) {
  return <>{children}</>;
}
