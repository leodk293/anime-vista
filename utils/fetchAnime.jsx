const fetchAnime = async (url) => {
    try {
        const response = await fetch(url);
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

export default fetchAnime;