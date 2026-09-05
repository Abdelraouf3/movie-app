const KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchFromTmdb = async (endpoint: string, extraParams: string = '') => {

    try {
    
        const delimiter = endpoint.includes("?") ? "&" : "?";
    
        const fullUrl = `${BASE_URL}${endpoint}${delimiter}api_key=${KEY}${extraParams ? `&${extraParams}` : ``}`
    
        const response = await fetch(fullUrl);
    
        if (!response.ok) {
            throw new Error(`TMDB API ERROR: ${response.status}`);
        }
    
        return await response.json();
    
    } catch (error) {
    
        throw error;
    
    }

};

export const fetchTvShowWithEpisodes = async (seriesId: number) => {

    try {
    
        const baseData = await fetchFromTmdb(`/tv/${seriesId}`);
    
        const totalSeasons = baseData.number_of_seasons;

        if (!totalSeasons) return baseData;

        const dynamicAppend = Array.from({ length: totalSeasons }, (_, i) => `season/${i + 1}`).join(',');

        const fullData = await fetchFromTmdb(`/tv/${seriesId}`, `append_to_response=${dynamicAppend}`);
        
        return fullData;
    
    } catch (error) {
    
        console.error(`Failed to fetch complete season details for TV Show (${seriesId}):`, error);
    
        return null;
    
    }

};

const determineQuality = (dateString: string | undefined): string => {
    if (!dateString) return "HD";
    const releaseDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - releaseDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays >= -15 && differenceInDays <= 60) {
        return "CAM | EaZy";
    }
    const qualities = ["HD", "4K UltraHD", "BluRay | 1080p", "DCPRip"];
    const randomIndex = Math.floor(Math.random() * qualities.length);
    return qualities[randomIndex];
};

const GENRE_MAP: Record<number, string> = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    18: "Drama", 14: "Fantasy", 27: "Horror", 9648: "Mystery", 878: "Sci-Fi",
    53: "Thriller", 10759: "Action & Adventure", 10765: "Sci-Fi & Fantasy"
};

export const fetchEnrichedMediaList = async (rawItems: any[]) => {
    const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

    const detailedPromises = rawItems.map(async (item) => {
        const isMovie = item.media_type === "movie" || "title" in item;
        const typePath = isMovie ? "movie" : "tv";

        try {
            const results = await Promise.allSettled([
                fetchFromTmdb(`/${typePath}/${item.id}`),
                fetchFromTmdb(`/${typePath}/${item.id}/${isMovie ? "release_dates" : "content_ratings"}`)
            ]);

            if (results[0].status === "rejected") {
                throw new Error(`Main media details not found for ID ${item.id}`);
            }

            const details = results[0].value;
            const ratingsData = results[1].status === "fulfilled" ? results[1].value : { results: [] };

            let ageCategory = "PG-13"; 
            const usResults = ratingsData?.results?.find((r: any) => r.iso_3166_1 === "US");
        
            if (isMovie && usResults) {
                const cert = usResults.release_dates?.find((d: any) => d.certification)?.certification;
                if (cert) ageCategory = cert;
            } else if (!isMovie && usResults) {
                if (usResults.rating) ageCategory = usResults.rating;
            }

            const rawDate = isMovie ? details.release_date : details.first_air_date;
            const parsedYear = rawDate ? parseInt(rawDate.split("-")[0]) : 2026;
            const automaticQuality = determineQuality(rawDate);

            const runtimeMinutes = isMovie 
                ? details.runtime 
                : (details.episode_run_time?.[0] || 45);

            return {
                id: details.id,
                title: isMovie ? details.title : details.name,
                description: details.overview,
                genre: item.genre_ids ? item.genre_ids.map((id: number) => GENRE_MAP[id] || "Media") : ["Drama"],
                IMDBRate: details.vote_average ? details.vote_average.toFixed(1) : "N/A",
                quality: automaticQuality,
                category: ageCategory,
                time: `${runtimeMinutes} min`,
                year: parsedYear,
                bannerBackgroundImage: details.backdrop_path ? `${TMDB_IMAGE_BASE}${details.backdrop_path}` : "",
                bannerPosterImage: details.poster_path ? `${TMDB_IMAGE_BASE}${details.poster_path}` : ""
            };

        } catch (error) {
            return null;
        }
    });

    const resolvedItems = await Promise.all(detailedPromises);
    
    return resolvedItems.filter((item): item is NonNullable<typeof item> => item !== null);
};