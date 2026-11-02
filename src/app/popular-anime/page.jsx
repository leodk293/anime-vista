import AnimeType from "../../../components/AnimeType";

const PopularAnimePage = () => {
  return (
    <AnimeType
      animeTypeName={"All Time Popular"}
      url={
        "https://api.myanimelist.net/v2/anime/ranking?ranking_type=bypopularity&limit=100&fields=id,title,main_picture,alternative_titles,start_season,genres"
      }
    />
  );
};

export default PopularAnimePage;
