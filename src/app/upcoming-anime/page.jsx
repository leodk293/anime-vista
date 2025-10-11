import AnimeType from "../../../components/AnimeType";

const UpcomingAnimePage = () => {
  return (
    <AnimeType
      animeTypeName={"Upcoming Next Season"}
      url={"https://api.jikan.moe/v4/seasons/upcoming"}
    />
  );
};

export default UpcomingAnimePage;
