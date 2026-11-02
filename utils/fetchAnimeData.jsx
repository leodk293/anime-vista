const MAL_FIELDS = [
  "id",
  "title",
  "main_picture",
  "alternative_titles",
  "synopsis",
  "mean",
  "rank",
  "popularity",
  "num_episodes",
  "status",
  "genres",
  "start_date",
  "end_date",
  "media_type",
  "start_season",
  "broadcast",
  "average_episode_duration",
  "studios",
].join(",");

const fetchAnimeData = async (animeId) => {
  try {
    const response = await fetch(
      `https://api.myanimelist.net/v2/anime/${animeId}?fields=${MAL_FIELDS}`,
      {
        headers: {
          "X-MAL-CLIENT-ID": process.env.NEXT_PUBLIC_CLIENT_ID,
        },
        cache: "no-store",
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch anime data");
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default fetchAnimeData;
