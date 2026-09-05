export interface TmdbTvEpisodeShort {
    id: number;
    name: string;
    overview: string;
    air_date: string;
    episode_number: number;
    season_number: number;
    show_id: number;
    vote_average: number;
    vote_count: number;
    episode_type: string;
    production_code: string;
    runtime: number | null;
    still_path: string | null;
}

export interface TmdbTvSeasonShort {
    id: number;
    name: string;
    overview: string;
    air_date: string | null;
    episode_count: number;
    season_number: number;
    poster_path: string | null;
    vote_average: number;
}

export interface TmdbPeopleDetails {

    adult: boolean,
    also_known_as: [],
    biography: string,
    birthday: string | null,
    deathday: string | null,
    gender: number,
    homepage: string | null,
    id: number,
    imdb_id: string | null,
    known_for_department: string | null,
    name: string,
    place_of_birth: string | null,
    popularity: number,
    profile_path: string | null

}

export interface TmdbBaseMedia {
    id: number;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    popularity: number;
    vote_average: number;
    vote_count: number;
    original_language: string;
    adult: boolean;
}

// Carries all standard Movie List items (Popular, Top Rated, Trending, Upcoming)
export interface TmdbMovieListItem extends TmdbBaseMedia {
    title: string;
    original_title: string;
    release_date: string;
    media_type?: "movie"; 
    video: boolean;
    genre_ids: number[];
}

// Carries all standard TV List items (Popular, Top Rated, Trending, Airing Today)
export interface TmdbTvListItem extends TmdbBaseMedia {
    name: string;
    original_name: string;
    first_air_date: string;
    media_type?: "tv";
    origin_country: string[];
    genre_ids: number[];
}

// Extra shared fields only found inside full detail lookups
interface TmdbDetailedMetadata {
    budget?: number; 
    revenue?: number; 
    genres: { id: number; name: string }[];
    homepage: string;
    status: string;
    tagline: string;
    origin_country: string[];
    spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
    production_companies: {
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }[];
    production_countries: { iso_3166_1: string; name: string }[];
}

// Complete Movie Profile Object Details
export interface TmdbLatestMovie extends TmdbBaseMedia, TmdbDetailedMetadata {
    title: string;
    original_title: string;
    release_date: string;
    imdb_id: string | null;
    video: boolean;
    runtime: number | null;
    belongs_to_collection: {
        id: number;
        name: string;
        poster_path: string | null;
        backdrop_path: string | null;
    } | null;
}

// Complete TV Profile Object Details
export interface TmdbTvShowsDetails extends TmdbBaseMedia, TmdbDetailedMetadata {
    name: string;
    original_name: string;
    first_air_date: string;
    last_air_date: string;
    type: string;
    in_production: boolean;
    languages: string[];
    episode_run_time: number[];
    last_episode_to_air: TmdbTvEpisodeShort | null;
    next_episode_to_air: TmdbTvEpisodeShort | null;
    seasons: TmdbTvSeasonShort[];
    created_by: {
        id: number;
        credit_id: string;
        name: string;
        original_name: string;
        gender: number;
        profile_path: string | null;
    }[];
    networks: {
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }[];
}