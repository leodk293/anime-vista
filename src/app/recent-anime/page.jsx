import AnimeType from "../../../components/AnimeType";

const RecentAnimePage = () => {
  return (
    <AnimeType
      animeTypeName={"Recent Anime"}
      url={"https://api.jikan.moe/v4/seasons/now"}
    />
  );
};

export default RecentAnimePage;
