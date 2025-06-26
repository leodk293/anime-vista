import AnimeType from "../../../components/AnimeType";

const PopularAnimePage = () => {
  return (
    <AnimeType
      animeTypeName={"All Time Popular"}
      url={"https://api.jikan.moe/v4/top/anime?filter=bypopularity"}
    />
  );
};

export default PopularAnimePage;
