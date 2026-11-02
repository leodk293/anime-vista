import AnimeType from "../../../components/AnimeType";

const UpcomingAnimePage = () => {
  return (
    <AnimeType
      animeTypeName={"Upcoming Next Season"}
      url={
        "https://api.myanimelist.net/v2/anime/ranking?ranking_type=upcoming&limit=100&fields=id,title,main_picture,alternative_titles,start_season,genres"
      }
    />
  );
};

export default UpcomingAnimePage;
