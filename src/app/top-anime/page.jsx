import AnimeType from "../../../components/AnimeType";

const TopAnimePage = () => {
  return (
    <AnimeType
      animeTypeName={"Top Anime"}
      url={"https://api.jikan.moe/v4/top/anime"}
    />
  )
}

export default TopAnimePage