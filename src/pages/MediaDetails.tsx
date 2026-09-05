import Loader from '@/components/UI/Loader';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { fetchFromTmdb, fetchTvShowWithEpisodes } from '@/Services/API/tmdb';
import LabelBadge from '@/components/UI/LabelBadge';
import Button from '@/components/UI/Button';
import { faInfoCircle, faPlay, faShareNodes, faStar, faUpDown, faVideo, faX } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faBookmark, faCalendar, faClock, faComment, faEnvelope, faHeart, faImage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardGrid from '@/components/CardGrid';

interface ProductionCompaniesDetails {
    id?: number;
    logo_path?: string;
    name?: string;
    origin_country?: string;
}

interface ProductionCountriesDetails {
    iso_3166_1?: string;
    name?: string;
}

interface SpokenLanguages {
    english_name?: string,
    iso_639_1?: string,
    name?: string;
}

interface MediaCast {
    adult: boolean;
    cast_id: number;
    character: string;
    credit_id: string;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    order: number;
    original_name: string;
    popularity: number;
    profile_path: string;
    job?: string;
}

interface TMDBCreatedBy {
    credit_id: string;
    gender: number;
    id: number;
    name: string;
    original_name: string;
    profile_path: string
}

interface TMDBNetworks {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
}

interface TMDBDataDetails {
    id?: number;
    backdrop_path?: string;
    release_date?: string;
    first_air_date?: string;
    last_air_date?: string;
    number_of_episodes?: number;
    number_of_seasons?: number;
    networks?: TMDBNetworks[];
    genres?: { id: number; name: string }[];
    title?: string;
    name?: string;
    country?: string;
    original_language?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    vote_average?: number;
    vote_count?: number;
    production_companies?: ProductionCompaniesDetails[];
    production_countries?: ProductionCountriesDetails[];
    spoken_languages?: SpokenLanguages[];
    revenue?: number;
    quality?: string;
    rating?: number;
    tagline?: string;
    status?: string;
    runtime?: number;
    budget?: number;
    credits?: {
        cast?: MediaCast[];
        crew?: MediaCast[];
    };
    created_by?: TMDBCreatedBy[];
    [key: `season/${number}`]: TMDBSeasonDetail | any;
    seasons?: TMDBTvShowSeason[];
}

interface TMDBDataImagesDetails {
    aspect_ratio?: number;
    height: 800,
    iso_639_1: null,
    file_path: string,
    vote_average: number,
    vote_count: number,
    width: number
}

interface TMDBDataImages {
    backdrops?: TMDBDataImagesDetails[];
    id?: number;
    logos?: TMDBDataImagesDetails[];
    posters?: TMDBDataImagesDetails[];
}

interface TMDBDataVideosDetails {
    iso_639_1: string,
    iso_3166_1: string,
    name: string,
    key: string,
    site: string,
    size: number,
    type: string,
    official: boolean,
    published_at: string,
    id: string
}

interface TMDBDataVideos {
    id?: number;
    results?: TMDBDataVideosDetails[];
}

interface EpisodeCrewOrGuest {
    id: number;
    name: string;
    original_name: string;
    character?: string; // Present for guest stars
    job?: string;       // Present for crew
    department?: string;
    credit_id: string;
    adult: boolean;
    gender: number;
    known_for_department: string;
    popularity: number;
    profile_path: string | null;
    order?: number;
}

interface TMDBEpisode {
    id: number;
    show_id: number;
    season_number: number;
    episode_number: number;
    name: string;
    overview: string;
    air_date: string;
    episode_type: string;
    production_code: string;
    runtime: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
    crew: EpisodeCrewOrGuest[];
    guest_stars: EpisodeCrewOrGuest[];
}

interface TMDBSeasonDetail {
    _id?: string;
    id: number;
    season_number: number;
    name: string;
    overview: string;
    air_date: string;
    poster_path: string | null;
    vote_average: number;
    networks?: TMDBNetworks[];
    episodes: TMDBEpisode[];
}

interface TMDBTvShowSeason {
    air_date: string,
    episode_count: number,
    id: number,
    name: string,
    overview: string,
    poster_path: string,
    season_number: number,
    vote_average: number
}

const KEY = import.meta.env.VITE_TMDB_KEY;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w1280";

const MediaDetails = () => {

    const { mediaType = 'movie', mediaId, mediaName } = useParams<{ mediaType: 'movie' | 'tv'; mediaId: string; mediaName: string; }>();

    const [details, setDetails] = useState<string>('Overview')
    const [seasonSelected, setSeasonSelected] = useState<number>(1);

    const [media, setMedia] = useState<TMDBDataDetails | null>(null)
    const [images, setImages] = useState<TMDBDataImages | null>(null);
    const [videos, setVideos] = useState<TMDBDataVideos | null>(null);
    const [recommendationData, setRecommendationData] = useState<any[]>([]);
    const [similarData, setSimilarData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect( () => {
    
        if (!mediaId) return;
    
        const fetchMediaData = async () => {
        
            setIsLoading(true);
        
            try {
            
                const cleanId = parseInt(mediaId, 10); 
            
                if ( isNaN(cleanId) ) return;
            
                const apiImages = await fetchFromTmdb(`/${mediaType}/${cleanId}/images`, '')
            
                const apiVideos = await fetchFromTmdb(`/${mediaType}/${cleanId}/videos`, '')
            
                const recommendationAPI = await fetchFromTmdb(`/${mediaType}/${mediaId}/recommendations?api_key=${KEY}&language=en-US`);
            
                const similarAPI = await fetchFromTmdb(`/${mediaType}/${mediaId}/similar?api_key=${KEY}&language=en-US`);
            
                if (mediaType === 'movie') {
                
                    const apiData = await fetchFromTmdb(`/${mediaType}/${cleanId}`, `language=en-US&append_to_response=credits`);
                
                    setMedia(apiData || null);
                
                } else {
                
                    const apiData = await fetchTvShowWithEpisodes(cleanId);
                
                    setMedia(apiData || null);
                
                }
                
                    setRecommendationData(recommendationAPI.results || []);
                
                    setSimilarData(similarAPI.results || []);
                
                    setImages(apiImages || null);
                
                    setVideos(apiVideos || null);
            
            }
        
            catch (err) {
            
                console.log(`Error fetching ${mediaType} data: `, err);
            
            } finally {
            
                setIsLoading(false);
            
            }
        
        }
    
        fetchMediaData();
    
    }, [mediaType, mediaId] )

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) return dateString;
    
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',  
            day: 'numeric',
            year: 'numeric' 
        }).format(date);
    };

    const [sortingComments, setSortingComments] = useState<string>('Most recent');
    const sortingCommentsRef = useRef<HTMLDivElement>(null)
    const [sortingCommentsOpen, setSortingCommentsOpen] = useState<boolean>(false);

    useEffect( () => {
    
        const handleClickOutside = (event: MouseEvent) => {
        
            const target = event.target as Node
        
            if (sortingCommentsRef.current && !sortingCommentsRef.current.contains(target)) {
                setSortingCommentsOpen(false);
            }
        
        }
    
        if (sortingCommentsOpen) {
        
            window.document.body.style.overflow = 'hidden';
            window.document.body.style.touchAction = 'none';
            window.addEventListener('mousedown', handleClickOutside);
        
        } else {
        
            window.removeEventListener('mousedown', handleClickOutside);
            window.document.body.style.overflow = 'auto';
            window.document.body.style.touchAction = 'auto';
        
        }
    
        return () => {
        
            window.removeEventListener('mousedown', handleClickOutside);
            window.document.body.style.overflow = 'auto';
            window.document.body.style.touchAction = 'auto';
        
        }
    
    }, [sortingCommentsOpen] )

    if (isLoading) {
    
        return (
        
            <div className="relative min-h-100 w-full">
            
                <Loader isFullPage={false} />
            
            </div>
        
        );
    
    }

    if (!media) {
    
        return <div className="text-center py-10 my-96 text-gray-text">No data found.</div>;
    
    }

    const directors = media.credits?.crew?.filter(member => member.known_for_department === 'Directing') || [];
    const writers = media.credits?.crew?.filter(member => member.known_for_department === 'Writing') || [];
    const producers = media.credits?.crew?.filter(member => member.known_for_department === 'Production' || member.known_for_department === 'Executive Producer') || [];

    return (
    
        <>
        
            <div className='container mx-auto px-2 xl:px-4 py-20'>
            
                <div className="flex-center">
                
                    <div className='container mx-auto px-2 xl:px-4'>
                    
                        <div className="hidden md:block md:h-[60vh] lg:h-full w-full">
                        
                            <img src={`${TMDB_IMAGE_BASE}${media.backdrop_path}`} alt={`${mediaName}`} title={`${mediaName}`} className='w-full h-full rounded-lg object-cover' loading='lazy' />
                        
                        </div>
                    
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-16">
                        
                            <div className="col-span-1 relative aspect-poster w-full place-self-start xl:-mt-32 md:flex md:w-56 lg:w-60 xl:w-80 self-center">
                            
                                <img src={`${TMDB_IMAGE_BASE}${media.poster_path}`} alt={`${mediaName}`} title={`${mediaName}`} className='size-full xl:-mt-32 rounded-md border border-zinc-deep object-cover' loading='lazy' />
                            
                            </div>
                        
                            <div className='space-y-4 my-8 md:col-span-2 lg:col-span-3 ms-5'>
                            
                                <div className="flex items-center flex-wrap gap-3">
                                
                                    <LabelBadge rate={media.vote_average ? Number(media.vote_average.toFixed(1)) : 0} className='yellowRoundedBadge-base hover:opacity-80' />
                                
                                    { media.genres.map( (genre: any, index) => (
                                    
                                        <LabelBadge key={index} label={genre.name} className='bg-white/10 text-[12px] py-1 px-2 rounded-sm' />
                                    
                                    ) ) }
                                
                                </div>
                            
                                <h3 className='text-[25px] md:text-[40px]'>{mediaName}</h3>
                            
                                { media.tagline && (
                                
                                    <p className='text-gray-text'>{media.tagline}</p>
                                
                                ) }
                            
                                <p className="text-gray-text">{media.overview}</p>
                            
                                <div className="flex items-center flex-wrap gap-2">
                                
                                    <Button link internal to={`/watch/${mediaType}/${media.id}/${mediaName}`} label='Watch now' firstIcon={faPlay} firstIconClassName='text-black' buttonClassName='roundedYellowBtn-base roundedYellowBtn-hover rounded-md' />
                                
                                    { [
                                        {label: 'Youtube Trailer', icon: faYoutube, link: ``},
                                        {label: 'Add to Favorites', icon: faHeart, link: ``},
                                        {label: 'Add to Wishlist', icon: faBookmark, link: ``}].map( (button: any, index) => (
                                        
                                            <Button key={index} label={`${button.label}`} buttonClassName={`grayBtn-base bg-black border border-gray-border/20 text-[14px] hover:bg-gray-500 hover:text-black`} firstIcon={button.icon} />
                                        
                                        ) 
                                    ) }
                                
                                </div>
                            
                            </div>
                        
                        </div>
                    
                        <div className="flex items-center gap-3 flex-wrap">
                        
                            <h4 className='text-[14px]'>Share on:</h4>
                        
                            { [
                                {label: 'WhatsApp', icon: faComment, link: ``},
                                {label: '', icon: faFacebookF, link: ``},
                                {label: 'Email', icon: faEnvelope, link: ``},
                                {label: 'reddit', icon: faShareNodes, link: ``},
                                {label: 'Twitter', icon: faX, link: ``}].map( (button: any, index) => (
                                
                                    <Button key={index} label={`${button.label}`} buttonClassName={`grayBtn-base grayBtn-hover text-[14px]`} firstIcon={button.icon} />
                                
                                ) 
                            ) }
                        
                        </div>
                    
                        <div className='grayBtn-base rounded-lg p-1 overflow-y-hidden overflow-x-scroll md:overflow-x-hidden mt-5'>
                        
                            <ul className="flex items-center w-full gap-1">
                            
                                { mediaType === 'movie' ? ['Overview', 'Credits', 'Reviews', 'Images', 'Videos', 'Recommendations', 'Similar'].map( (cate, index) => (
                                
                                    <li key={index} className='flex-1 w-full text-center'>
                                    
                                        <Button 
                                            buttonClassName={`text-white ${details === cate ? `bg-night-base` : `bg-transparent`} rounded-sm w-full py-1 xl:px-10 text-[14px] text-center transition-colors duration-300 `} 
                                            label={cate}
                                            secondIcon={cate === 'Credits' ? faInfoCircle : undefined}
                                            onClick={ () => setDetails(cate) }
                                        />
                                    
                                    </li>
                                
                                ) ) : ['Overview', 'Credits', 'Watch', 'Comments', 'Seasons', 'Images', 'Videos', 'Recommendations', 'Similar'].map( (cate, index) => (
                                
                                    <li key={index} className='flex-1 w-full text-center'>
                                    
                                        <Button 
                                            buttonClassName={`text-white ${details === cate ? `bg-night-base` : `bg-transparent`} rounded-sm w-full py-1 xl:px-10 text-[14px] text-center transition-colors duration-300 `} 
                                            label={cate}
                                            secondIcon={cate === 'Credits' ? faInfoCircle : undefined}
                                            onClick={ () => setDetails(cate) }
                                        />
                                    
                                    </li>
                                
                                ) ) }
                            
                            </ul>
                        
                        </div>
                    
                        { details && details === 'Overview' && (
                        
                            <>
                            
                                <div className='flex flex-wrap md:grid md:grid-cols-4 gap-3 my-7 border border-white-border rounded-sm p-8'>
                                
                                    { mediaType === 'tv' && (
                                    
                                        <div>
                                        
                                            <h2 className='md:text-xl'>Created By</h2>
                                        
                                            { media?.created_by && media?.created_by?.length > 0 && (
                                            
                                                <span className='text-gray-text mt-3 text-sm md:text-base'>{ media.created_by.map(createdBy => createdBy.original_name).join(', ') || "-" }</span>
                                            
                                            ) }
                                        
                                        </div>
                                    
                                    ) }
                                
                                    <div>
                                    
                                        <h2 className='md:text-xl'>Status</h2>
                                    
                                        <span className='text-gray-text mt-3 text-sm md:text-base'>{media.status || "-"}</span>
                                    
                                    </div>
                                
                                    <div>
                                    
                                        <h2 className='md:text-xl'>{mediaType.toLowerCase() === 'movie' ? 'Original Title' : 'Original Name' }</h2>
                                    
                                        <span className='text-gray-text mt-3 text-sm md:text-base'>{mediaName || "-"}</span>
                                    
                                    </div>
                                
                                    { mediaType.toLowerCase() === 'movie' ? (
                                    
                                        <div>
                                        
                                            <h2 className='md:text-xl'>Release Date</h2>
                                        
                                            <span className='text-gray-text mt-3 text-sm md:text-base'>{formatDate(media.release_date) || "-"}</span>
                                        
                                        </div>
                                    
                                    ) : (
                                    
                                        <>
                                        
                                            <div>
                                            
                                                <h2 className='md:text-xl'>First Air Date</h2>
                                            
                                                <span className='text-gray-text mt-3 text-sm md:text-base'>{formatDate(media.first_air_date) || "-"}</span>
                                            
                                            </div>
                                            
                                            <div>
                                            
                                                <h2 className='md:text-xl'>Last Air Date</h2>
                                            
                                                <span className='text-gray-text mt-3 text-sm md:text-base'>{formatDate(media.last_air_date) || "-"}</span>
                                            
                                            </div>
                                        
                                        </>
                                    
                                    ) }
                                
                                    { mediaType.toLowerCase() === 'tv' && (
                                    
                                        <>
                                        
                                            <div>
                                            
                                                <h2 className='md:text-xl'>Seasons</h2>
                                            
                                                <span className='text-gray-text mt-3 text-sm md:text-base'>{media.number_of_seasons || 0}</span>
                                            
                                            </div>
                                            
                                            <div>
                                            
                                                <h2 className='md:text-xl'>Episodes</h2>
                                            
                                                <span className='text-gray-text mt-3 text-sm md:text-base'>{media.number_of_episodes || 0}</span>
                                            
                                            </div>
                                        
                                        </>
                                    
                                    ) }
                                
                                    <div>
                                    
                                        <h2 className='md:text-xl'>Language</h2>
                                    
                                        { media?.spoken_languages && media?.spoken_languages?.length > 0 && (
                                        
                                            <span className='text-gray-text mt-3 text-sm md:text-base'>{ media.spoken_languages.map(language => language.english_name).join(', ') || "-" }</span>
                                        
                                        ) }
                                    
                                    </div>
                                
                                    { mediaType.toLowerCase() === 'movie' && (
                                    
                                        <>
                                        
                                            <div>
                                            
                                                <h2 className='md:text-xl'>Runtime</h2>
                                            
                                                <span className='text-gray-text mt-3 text-sm md:text-base'>{media.runtime || '-'}</span>
                                            
                                            </div>
                                        
                                            <div>
                                            
                                                <h2 className='md:text-xl'>Budget</h2>
                                            
                                                <span className='text-gray-text mt-3 text-sm md:text-base'>${media.budget?.toLocaleString() || '-'}</span>
                                            
                                            </div>
                                        
                                            <div>
                                            
                                                <h2 className='md:text-xl'>Revenue</h2>
                                            
                                                <span className='text-gray-text mt-3 text-sm md:text-base'>${media.revenue?.toLocaleString() || "-"}</span>
                                            
                                            </div>
                                        
                                        </>
                                    
                                    ) }
                                
                                    <div>
                                    
                                        <h2 className='md:text-xl'>Production Companies</h2>
                                    
                                        { media?.production_companies && media?.production_companies?.length > 0 && (
                                        
                                            <div className='mt-3 text-sm md:text-base'>
                                            
                                                {media.production_companies.map((company, index) => (
                                                
                                                    <span key={company.id || index} className="border-b-2 border-zinc-deep text-gray-text hover:text-white-ghost mr-2">{company.name}</span>
                                                
                                                ))}
                                            
                                            </div>
                                        
                                        ) || "-" } 
                                    
                                    </div>
                                
                                    { mediaType.toLowerCase() === 'tv' && (
                                    
                                        <div>
                                        
                                            <h2 className='md:text-xl'>Networks</h2>
                                        
                                            { media?.networks && media?.networks?.length > 0 && (
                                            
                                                <div className='mt-3 text-sm md:text-base'>
                                                
                                                    {media.networks.map((network, index) => (
                                                    
                                                        <span key={network.id || index} className="border-b-2 border-zinc-deep text-gray-text hover:text-white-ghost mr-2">{network.name}</span>
                                                    
                                                    ))}
                                                
                                                </div>
                                            
                                            ) || "-" } 
                                        
                                        </div>
                                    
                                    ) }
                                
                                </div>
                            
                                { mediaType === 'tv' && (
                                
                                    <div className={`hidden md:block relative overflow-hidden min-h-140 h-[60vh] w-full`}>
                                    
                                        <img src={`${TMDB_IMAGE_BASE}${media['season/1'].episodes[0].still_path}`} alt={media['season/1'].episodes[0].name} className={`border border-white-border rounded-md h-full w-full object-cover`} loading='lazy' />
                                    
                                        <div className='absolute inset-0 bg-[linear-gradient(0deg,rgba(21,26,36,0.9),transparent_70%)]'></div>
                                    
                                        <div className="absolute left-6 bottom-3 z-20 space-y-3 w-1/2 ">
                                        
                                            <p className='bg-white py-2 px-4 rounded-lg text-black font-Roboto-Bold text-[12px] inline-block'>S01 E01</p>                                       
                                        
                                            <h3>{media['season/1'].episodes[0].name}</h3>
                                        
                                            <p className="text-gray-text">{media['season/1'].episodes[0].overview}</p>
                                        
                                            <Button label='View Episodes' buttonClassName='whiteBtn-base whiteBtn-hover' />
                                        
                                        </div>
                                    
                                    </div>
                                
                                ) }
                            
                            </>
                        
                        ) }
                    
                        { details && details === 'Credits' && (
                        
                            <div className="my-5">
                            
                                <h4 className='text-lg my-5'>Cast</h4>
                            
                                { media && media.credits?.cast && media.credits.cast.length > 0 ? (
                                
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-2">
                                    
                                        { media.credits.cast.slice(0, 18).map( (member, index) => (
                                        
                                            <div key={index} className='col-span-1 w-full'>
                                            
                                                { member.known_for_department === "Acting" ? (
                                                
                                                    <div className="rounded-md overflow-hidden aspect-2/3 relative cursor-pointer">
                                                    
                                                        { member.profile_path ? (
                                                        
                                                            <img src={`${TMDB_IMAGE_BASE}${member.profile_path}`} alt={member.name} title={member.name} className="w-full h-full object-cover" loading="lazy" />
                                                        
                                                        ) : (
                                                        
                                                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-text">
                                                                No Image Available
                                                            </div>
                                                        
                                                        ) }
                                                    
                                                        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(21,26,36,.9),transparent_70%)]"></div>
                                                    
                                                        <div className="absolute left-2 bottom-0 z-10">
                                                        
                                                            <h4 className="title-sub truncate text-[16px]">{member.name}</h4>
                                                        
                                                            <h4 className="title-sub truncate text-[14px] text-gray-text">{member.character}</h4>
                                                        
                                                        </div>
                                                    
                                                    </div>
                                                
                                                ) : '' }
                                            
                                            </div>
                                        
                                        ) ) }
                                    
                                    </div>
                                
                                ) : ( 
                                
                                    <p className="text-gray-text text-sm italic">No cast information available for this title.</p>
                                
                                ) }
                            
                                <h4 className='text-lg my-5'>Director</h4>
                            
                                { directors.length > 0 ? (
                                
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-2">
                                    
                                        { directors.slice(0, 1).map((director, index) => (
                                        
                                            <div key={index} className='col-span-1 w-full'>
                                            
                                                <div className="rounded-md overflow-hidden aspect-2/3 relative cursor-pointer">
                                                
                                                    { director.profile_path ? (
                                                    
                                                        <img src={`${TMDB_IMAGE_BASE}${director.profile_path}`} alt={director.name} title={director.name} className="w-full h-full object-cover" loading="lazy" />
                                                    
                                                    ) : (
                                                    
                                                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-text">
                                                            No Image Available
                                                        </div>
                                                    
                                                    ) }
                                                
                                                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(21,26,36,.9),transparent_70%)]"></div>
                                                
                                                    <div className="absolute left-2 bottom-0 z-10">
                                                    
                                                        <h4 className="title-sub truncate text-[16px]">{director.name}</h4>
                                                    
                                                        <h4 className="title-sub truncate text-[14px] text-gray-text">{director.job}</h4>
                                                    
                                                    </div>
                                                
                                                </div>
                                            
                                            </div>
                                        
                                        )) }
                                    
                                    </div>
                                
                                ) : (
                                
                                    <p className="text-gray-text text-xs italic">Director data unavailable.</p>
                                
                                ) }
                            
                                <h4 className='text-lg my-5'>Producers</h4>
                            
                                { producers.length > 0 ? (
                                
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-2">
                                    
                                        { producers.map((producer, index) => (
                                        
                                            <div key={index} className='col-span-1 w-full'>
                                            
                                                <div className="rounded-md overflow-hidden aspect-2/3 relative cursor-pointer">
                                                
                                                    { producer.profile_path ? (
                                                    
                                                        <img src={`${TMDB_IMAGE_BASE}${producer.profile_path}`} alt={producer.name} title={producer.name} className="w-full h-full object-cover" loading="lazy" />
                                                    
                                                    ) : (
                                                    
                                                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-text">
                                                            No Image Available
                                                        </div>
                                                    
                                                    ) }
                                                
                                                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(21,26,36,.9),transparent_70%)]"></div>
                                                
                                                    <div className="absolute left-2 bottom-0 z-10">
                                                    
                                                        <h4 className="title-sub truncate text-[16px]">{producer.name}</h4>
                                                    
                                                        <h4 className="title-sub truncate text-[14px] text-gray-text">{producer.job}</h4>
                                                    
                                                    </div>
                                                
                                                </div>
                                            
                                            </div>
                                        
                                        )) }
                                    
                                    </div>
                                
                                ) : (
                                
                                    <p className="text-gray-text text-sm italic">Producer data unavailable.</p>
                                
                                ) }
                            
                                <h4 className='text-lg my-5'>Writers</h4>
                            
                                { writers.length > 0 ? (
                                
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-2">
                                    
                                        { writers.map((writer, index) => (
                                        
                                            <div key={index} className='col-span-1 w-full'>
                                            
                                                <div className="rounded-md overflow-hidden aspect-2/3 relative cursor-pointer">
                                                
                                                    { writer.profile_path ? (
                                                    
                                                        <img src={`${TMDB_IMAGE_BASE}${writer.profile_path}`} alt={writer.name} title={writer.name} className="w-full h-full object-cover" loading="lazy" />
                                                    
                                                    ) : (
                                                    
                                                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-text">
                                                            No Image Available
                                                        </div>
                                                    
                                                    ) }
                                                
                                                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(21,26,36,.9),transparent_70%)]"></div>
                                                
                                                    <div className="absolute left-2 bottom-0 z-10">
                                                    
                                                        <h4 className="title-sub truncate text-[16px]">{writer.name}</h4>
                                                    
                                                        <h4 className="title-sub truncate text-[14px] text-gray-text">{writer.job}</h4>
                                                    
                                                    </div>
                                                
                                                </div>
                                            
                                            </div>
                                        
                                        )) }
                                    
                                    </div>
                                
                                ) : (
                                
                                    <p className="text-gray-text text-xs italic">Writer data unavailable.</p>
                                
                                ) }
                        
                            </div>
                        
                        ) }
                    
                        { details && (details === 'Reviews' || details === 'Comments') && (
                        
                            <>
                        
                                <div className="my-6 bg-[#111318] p-6 border border-white-border rounded-md">
                                
                                    <div className="text-center bg-white/3 rounded-md space-y-2 py-6">
                                    
                                        <h4 className="text-white text-lg font-Inter_18pt-SemiBold">Join the Conversation</h4>
                                    
                                        <p className='text-gray-text text-sm'>Sign in to write your own comment.</p>
                                    
                                        <Button link internal to='/login' buttonClassName={`inline-block roundedYellowBtn-base roundedYellowBtn-hover px-2`} label='Sign In' />
                                    
                                    </div>
                                
                                </div>
                            
                                <div className="bg-[#111318] p-6 border border-white-border rounded-md">
                                
                                    <div className="flex-between flex-wrap pb-5 border-b border-white-border">
                                    
                                        <div className="flex items-center gap-3">
                                        
                                            <h4 className='text-[20px] font-Inter_18pt-SemiBold'>Comments</h4>
                                        
                                            <LabelBadge className='yellowRoundedBadge-base yellowRoundedBadge-hover flex-center' rate={0}  />
                                        
                                        </div>
                                    
                                        <div className='relative'>
                                        
                                            <p className='text-gray-text text-sm transition-colors duration-300 hover:text-white cursor-pointer'
                                                onClick={ () => setSortingCommentsOpen(!sortingCommentsOpen) }
                                            > 
                                            
                                                <span className='me-2'><FontAwesomeIcon icon={faUpDown} /></span>
                                            
                                                {sortingComments}
                                            
                                            </p>
                                        
                                            { sortingCommentsOpen && (
                                            
                                                <div className="absolute top-5 left-0 right-auto min-[425px]:right-0 min-[425px]:left-auto w-36 bg-night-base border border-white-border p-1 rounded-md"
                                                    ref={sortingCommentsRef}>
                                                
                                                    <ul className='group'>
                                                    
                                                        { ['Most recent', 'Top rated', 'Oldest'].map( (sortingBy, index) => { 
                                                        
                                                            const isActive = sortingBy === sortingComments;
                                                        
                                                            return (
                                                            
                                                                <li key={index}>
                                                                
                                                                    <Button 
                                                                        buttonClassName={`transition-colors duration-300 w-full justify-start ${isActive ? `bg-gold-bright text-white rounded-md group-hover:text-gold-bright group-hover:bg-gold-bright/10` : `text-white bg-transparent `}  mb-1 hover:bg-gold-bright hover:text-white hover:rounded-md`} 
                                                                        label={sortingBy} 
                                                                        onClick={ () => setSortingComments(sortingBy) }
                                                                        />
                                                                
                                                                </li>
                                                            ) 
                                                        
                                                        } ) }
                                                    
                                                    </ul>
                                                
                                                </div>
                                            
                                            ) }
                                        
                                        </div>
                                    
                                    </div>
                                
                                    <div className="text-center py-24 space-y-4">
                                    
                                        <span className='inline-block'><FontAwesomeIcon icon={faComment} className='text-gray-text text-[60px]'/></span>
                                    
                                        <h4 className='text-white text-lg font-Inter_18pt-SemiBold'>No Comments Yet</h4>
                                    
                                        <p className='text-gray-text text-sm'>Be the first to share your thoughts!</p>
                                    
                                    </div>
                                
                                </div>
                        
                            </>
                        
                        ) }
                    
                        { details && details === 'Images' && (
                        
                            <div className="my-5">
                            
                                <h4 className='text-lg my-5'><FontAwesomeIcon icon={faImage} /> Backdrops ({images.backdrops.length || 0})</h4>
                            
                                { images && images.backdrops?.length > 0 ? (
                                
                                    <div className='grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2'>
                                    
                                        { images.backdrops.slice(0, 9).map( (image, index) => (
                                        
                                            <div key={index} className="col-span-1 w-full">
                                            
                                                <div className={`rounded-md overflow-hidden aspect-${image.aspect_ratio} relative cursor-pointer`}>
                                                
                                                    <img src={`${TMDB_IMAGE_BASE}${image.file_path}`} alt={mediaName} title={mediaName} className={`w-${image.width} h-${image.height} object-cover`} loading="lazy" />
                                                
                                                </div>
                                            
                                            </div>
                                        
                                        ) ) }
                                    
                                    </div>
                                
                                ) : (
                                
                                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-text">
                                        No Backdrops Image Available
                                    </div>
                                
                                ) }
                            
                                <h4 className='text-lg my-5'><FontAwesomeIcon icon={faImage} /> Posters ({images.posters.length || 0})</h4>
                                
                                { images && images.posters?.length > 0 ? (
                                
                                    <div className='grid sm:grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-2'>
                                    
                                        { images.posters.slice(0, 12).map( (image, index) => (
                                        
                                            <div key={index} className="col-span-1 w-full">
                                            
                                                <div className={`rounded-md overflow-hidden aspect-${image.aspect_ratio} relative cursor-pointer`}>
                                                
                                                    <img src={`${TMDB_IMAGE_BASE}${image.file_path}`} alt={mediaName} title={mediaName} className={`w-${image.width} h-${image.height} object-cover`} loading="lazy" />
                                                
                                                </div>
                                            
                                            </div>
                                        
                                        ) ) }
                                    
                                    </div>
                                
                                ) : (
                                
                                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-text">
                                        No Backdrops Image Available
                                    </div>
                                
                                ) }
                            
                            </div>
                        
                        ) }
                    
                        { details && details === 'Videos' && (
                        
                            <div className="my-5">
                            
                                <h4 className='text-lg my-5'><FontAwesomeIcon icon={faVideo} /> Videos ({videos.results.length || 0})</h4>
                            
                                { videos && videos.results?.length > 0 ? (
                                
                                    <div className='grid sm:grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-2'>
                                    
                                        { videos.results.map( (video, index) => (
                                        
                                            <div key={index} className="col-span-1 w-full">
                                            
                                                <div className={`rounded-md overflow-hidden size-${video.size} h-96 relative cursor-pointer`}>
                                                
                                                    <iframe src={`https://www.youtube.com/embed/${video.key}`} className='size-full h-full'></iframe>
                                                
                                                </div>
                                            
                                            </div>
                                        
                                        ) ) }
                                    
                                    </div>
                                
                                ) : (
                                
                                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-text">
                                        No Videos Available
                                    </div>
                                
                                ) }
                            
                            </div>
                        
                        ) }
                    
                        { details && details === 'Recommendations' && (
                        
                            <>
                            
                                <h4 className='text-[20px] mt-3 mb-10 font-Roboto-SemiBold'>Recommended for you</h4>
                            
                                { recommendationData && recommendationData.length > 0 && (
                                
                                    <CardGrid items={recommendationData} mediaType={mediaType} loading={isLoading} className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-8 gap-y-2' />
                                
                                ) }
                            
                            </>
                        
                        ) }
                    
                        { details && details === 'Similar' && (
                        
                            <>
                            
                                <h4 className='text-[20px] mt-3 mb-10 font-Roboto-SemiBold'>Similar Movies</h4>
                            
                                { similarData && similarData.length > 0 ? (
                                
                                    <CardGrid items={similarData} mediaType={mediaType} loading={isLoading} className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-8 gap-y-2' />
                                
                                ) : (
                                
                                    <div className="text-center py-24 space-y-4">
                                    
                                        <span className='inline-block bg-black/30 rounded-full p-4'><FontAwesomeIcon icon={faPlay} className='text-gray-text text-[40px]'/></span>
                                    
                                        <h4 className='text-white text-lg font-Inter_18pt-SemiBold'>No Similar Content</h4>
                                    
                                        <p className='text-gray-text text-sm'>No similar movies are available at the moment.</p>
                                    
                                    </div>
                                
                                ) }
                            
                            </>
                        
                        ) }
                    
                        { details && details === 'Watch' && (
                        
                            <div className="my-5">
                            
                                <h4 className="text-2xl mb-5 font-Inter_28pt-Bold">Episodes</h4>
                            
                                <ul className='flex flex-wrap gap-3 mb-4'>
                                
                                    { [...Array(media.number_of_seasons)].map( (_, index) => (
                                    
                                        <li key={index}>
                                        
                                            <Button buttonClassName={`${seasonSelected === index + 1 ? `whiteBtn-base whiteBtn-hover` : `transparentBtn-base transparentBtn-hover`} text-[14px]`} label={`Season ${index + 1}`} onClick={ () => setSeasonSelected(index + 1) } />
                                        
                                        </li>
                                    
                                    ) ) }
                                
                                </ul>
                            
                                <div className='grid gap-4'>
                                
                                    { media[`season/${seasonSelected}`]?.episodes && media[`season/${seasonSelected}`]?.episodes?.length > 0 ? (
                                        
                                            media[`season/${seasonSelected}`]?.episodes.map( (episode: any) => (
                                            
                                                <div className={`rounded-md border border-zinc-deep/50 bg-night-base text-white-ghost shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group hover:border-white-ghost/20`}>
                                                
                                                    <div className="flex gap-4 p-4">
                                                    
                                                        <div className='w-52 h-28 shrink-0 relative rounded-lg overflow-hidden'>
                                                        
                                                            <img src={`${TMDB_IMAGE_BASE}${episode.still_path}`} alt={`${episode.name}`} className={`w-52 h-28 transition-transform duration-300 group-hover:scale-110`} loading='lazy' />
                                                        
                                                            <span className="absolute top-2 left-2 z-20 rounded-xl py-1 px-2 bg-white text-black font-Inter_18pt-Bold text-sm">EP {episode.episode_number}</span>
                                                        
                                                            <span className="absolute bottom-2 right-2 z-20 rounded-2xl py-1 px-3 bg-black/50 text-white font-Inter_24pt-Black"> <FontAwesomeIcon icon={faStar} className='text-brand-yellow' /> {episode.vote_average} </span>
                                                        
                                                            <div className='absolute top-1/2 left-1/2 -translate-1/2 flex-center bg-white p-2 rounded-full opacity-0 z-90 transition-all duration-300 group-hover:opacity-100'> <FontAwesomeIcon icon={faPlay} className='text-black' /> </div>
                                                        
                                                            <div className="absolute inset-0 bg-black/40 z-10 opacity-0 group-hover:opacity-100"></div>
                                                        
                                                        </div>
                                                    
                                                        <div className='flex-1 p-0'>
                                                        
                                                            <div className='flex items-start justify-between h-full'>
                                                            
                                                                <div className='flex-1 min-w-0 space-y-2'>
                                                                
                                                                    <h2 className='text-[22px] font-Inter_18pt-SemiBold'>{episode.name}</h2>
                                                                
                                                                    <div className="flex  gap-2 my-2">
                                                                    
                                                                        <span className='text-gray-text'><FontAwesomeIcon icon={faCalendar} /> {formatDate(episode.air_date)} </span>
                                                                    
                                                                        <span className='text-gray-text'><FontAwesomeIcon icon={faClock} /> {episode.runtime} min </span>
                                                                    
                                                                        <span className='text-gray-text'><FontAwesomeIcon icon={faStar} className='text-brand-yellow' /> {episode.vote_average} </span>
                                                                    
                                                                    </div>
                                                                
                                                                    <p className="text-gray-text">
                                                                    
                                                                        {episode.overview}
                                                                    
                                                                    </p>
                                                                
                                                                </div>
                                                            
                                                                <div>
                                                                
                                                                    <Button label='Watch Now' firstIcon={faPlay} buttonClassName='whiteBtn-base whiteBtn-hover flex-nowrap w-full group-hover:scale-105' />
                                                                
                                                                </div>
                                                            
                                                            </div>
                                                        
                                                        </div>
                                                    
                                                    </div>
                                                
                                                </div>
                                            
                                            ) )
                                        
                                        ) : (
                                        
                                            <div className="text-center py-24 space-y-4">
                                            
                                                <span className='inline-block'><FontAwesomeIcon icon={faVideo} className='text-gray-text text-[60px]'/></span>
                                            
                                                <h4 className='text-white text-lg font-Inter_18pt-SemiBold'>No Episodes Available</h4>
                                            
                                                <p className='text-gray-text text-sm'>Episodes are not available for this season yet.</p>
                                            
                                            </div>
                                        
                                        )
                                    
                                    }
                                
                                </div>
                            
                            </div>
                        
                        ) }
                    
                        { details && details === 'Seasons' && (
                        
                            media?.seasons && media.seasons?.length > 0 && (
                            
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 my-5">
                                
                                    { media.seasons.map( (season, index) => (
                                    
                                        <div key={index} className='col-span-1 w-full'>
                                        
                                            <div className="border border-white-border overflow-hidden rounded-md relative">
                                            
                                                <img src={`${TMDB_IMAGE_BASE}${season.poster_path}`} alt={season.name} loading='lazy' />
                                            
                                                <div className="absolute left-2 bottom-3 space-y-2">
                                                
                                                    <h3 className='capitalize font-Inter_18pt-Black text-lg'>{season.name}</h3>
                                                
                                                    <p className='font-Inter_18pt-Bold text-gray-text'><span>{season.episode_count}</span> Episodes</p>
                                                
                                                </div>
                                            
                                            </div>
                                        
                                        </div>
                                    
                                    ) ) }
                                
                                </div>
                            
                            )
                        
                        ) }
                    
                    </div>
                
                </div>
            
            </div>
        
        </>
    
    )

}

export default MediaDetails