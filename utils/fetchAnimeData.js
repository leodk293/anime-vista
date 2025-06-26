const fetchAnimeData = async (animeId) => {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
        if (!response.ok) {
            throw new Error("Failed to fetch anime data");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default fetchAnimeData;