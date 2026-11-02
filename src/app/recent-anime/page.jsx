import AnimeType from "../../../components/AnimeType";

const getCurrentSeason = (month) => {
  if (month >= 1 && month <= 3) return "winter";
  if (month >= 4 && month <= 6) return "spring";
  if (month >= 7 && month <= 9) return "summer";
  return "fall";
};

const RecentAnimePage = () => {
  const now = new Date();
  const year = now.getFullYear();
  const season = getCurrentSeason(now.getMonth() + 1);
  const fields = "id,title,main_picture,start_season,genres,alternative_titles";

  return (
    <AnimeType
      animeTypeName={"Recent Anime"}
      url={`https://api.myanimelist.net/v2/anime/season/${year}/${season}?limit=100&fields=${fields}`}
    />
  );
};

export default RecentAnimePage;
