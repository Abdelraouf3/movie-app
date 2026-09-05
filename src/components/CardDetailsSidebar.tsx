import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, Variants } from 'motion/react'
import Button from './UI/Button'
import posterImage from '../assets/images/posters/image.webp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBars, faList, faPlay, faStar, faStepBackward, faStepForward, faTableCells, faUpDown, faVideoSlash } from '@fortawesome/free-solid-svg-icons'
import { faCirclePlay, faClock, faComment, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import LabelBadge from './UI/LabelBadge'
import { fetchFromTmdb } from '@/Services/API/tmdb'
import CardGrid from './CardGrid'
import Dropdown from './UI/Dropdown'
import InputField from './UI/InputField'

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
    type?: string;
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

interface CardDetailsSidebarProps {
    data?: TMDBDataDetails | null;
    mediaType?: 'movie' | 'tv';
    mediaId?: string;
}

const KEY = import.meta.env.VITE_TMDB_KEY;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w1280";

const CardDetailsSidebar = ( { data, mediaType, mediaId }:CardDetailsSidebarProps ) => {

    const qualityBadge = data.quality || 'HD';

    const [details, setDetails] = useState<string>( mediaType === 'movie' ? 'Comments' : 'Playlist');
    const [seasonSelected, setSeasonSelected] = useState<number>(1);
    const [episodeSelected, setEpisodeSelected] = useState<number>(1)
    const Episodes = data[`season/${seasonSelected}`]?.episodes || [];
    const [searchEpisode, setSearchEpisode] = useState<any>('');
    const [episodeStyle, setEpisodeStyle] = useState<'individual' | 'group'> ('individual')

    const filteredEpisodes = Episodes?.filter( (episode: TMDBEpisode) => {
    
        const query = searchEpisode.toLowerCase().trim();
    
        const matchesName = episode.name.toLowerCase().includes(query);
    
        const matchesOverview = episode.overview.toLowerCase().includes(query);
    
        const matchesEpisodeNumber = episode.episode_number.toString().includes(query);
    
        return matchesName || matchesOverview || matchesEpisodeNumber
    
    } )

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

    const [recommendationData, setRecommendationData] = useState<any[]>([]);
    const [similarData, setSimilarData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect( () => {
    
        const fetchingData = async () => {
        
            setIsLoading(true);
        
            try {
            
                const recommendationAPI = await fetchFromTmdb(`/${mediaType}/${mediaId}/recommendations?api_key=${KEY}&language=en-US`);
            
                const similarAPI = await fetchFromTmdb(`/${mediaType}/${mediaId}/similar?api_key=${KEY}&language=en-US`);
            
                if (recommendationAPI.results) {
                
                    setRecommendationData(recommendationAPI.results);
                
                } else {
                
                    setRecommendationData([]);
                
                }
            
                if (similarAPI.results) {
                
                    setSimilarData(similarAPI.results);
                
                } else {
                
                    setSimilarData([]);
                
                }
            
            } catch (err) {
            
                console.log("Error fetch Data: ", err);
            
            } finally {
            
                setIsLoading(false);
            
            }
        
        } 
    
        fetchingData();
    
    }, [data, mediaType, mediaId] )

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { 
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        }
    }

    return (
    
        <div className='container mx-auto px-2 py-8 sm:px-4 pt-0 xl:pt-24 mb-28'>
        
            <div className="flex flex-col xl:flex-row gap-8 w-full">
            
                <motion.div className="flex-1 space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}>
                
                    <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4 text-sm text-gray-text flex-wrap">
                    
                        <Button link internal to='/' buttonClassName='text-gray-text bg-transparent text-[14px] p-0 transition-colors duration-300 hover:text-white hover:underline' label='Homepage' />
                    
                        <span className='hidden sm:inline text-gray-text'>•</span>
                    
                        <Button link internal to={`/${mediaType}/discover`} buttonClassName='text-gray-text bg-transparent text-[14px] p-0 transition-colors duration-300 hover:text-white hover:underline' label={`${ mediaType === 'tv' ? `${mediaType.toUpperCase()} Shows` : mediaType.toUpperCase()  }`} />
                    
                        <span className='hidden sm:inline text-gray-text'>•</span>
                    
                        <Button link internal to='/' buttonClassName='text-white bg-transparent text-[14px] p-0 transition-colors duration-300 hover:text-white hover:underline' label={`${mediaType === 'movie' ? data?.title : data?.name}`} />
                    
                        { mediaType === 'tv' && (
                        
                            <>
                            
                                <span className='hidden sm:inline text-gray-text'>•</span>
                            
                                <Button link internal to='/' buttonClassName='text-white bg-transparent text-[14px] p-0 transition-colors duration-300 hover:text-white hover:underline' label={`S${seasonSelected}E${episodeSelected}` || 'S1E1'} />
                            
                            </>
                        
                        ) }
                    
                    </motion.div>
                
                    <motion.div variants={itemVariants} className='aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 relative group'>
                    
                        <div className='absolute inset-0 z-10'>
                        
                            <div className="absolute inset-0">
                            
                                <img src={`${data?.backdrop_path?.length > 0 ? `${TMDB_IMAGE_BASE}${data?.backdrop_path}` : `${posterImage}`}`} alt={`${mediaType === 'movie' ? data?.title : data?.name}`} title={`${mediaType === 'movie' ? data?.title : data?.name}`} className='w-full h-full object-cover' loading='lazy' />
                            
                            </div> 
                        
                            <div className='absolute inset-0 bg-black/20'></div>
                        
                        </div>
                    
                        <div className='absolute inset-0 flex items-center justify-center z-999'>
                        
                            <div className='size-12 md:size-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                            
                                <div className='size-10 md:size-16 rounded-full bg-white flex items-center justify-center shadow-lg'>
                                
                                    <FontAwesomeIcon icon={faPlay} className='text-[16px] md:text-[20px] text-black cursor-pointer' />
                                
                                </div>
                            
                            </div>
                        
                        </div>
                    
                    </motion.div>
                
                    <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                    
                        <LabelBadge className={`${qualityBadge === 'HD' ? 'greenRoundedBadge' : 'yellowRoundedBadge-base'} flex-center rounded-full`} label='HD' />
                    
                        <LabelBadge className='yellowRoundedBadge-base yellowRoundedBadge-hover flex-center' rate={Number(data?.vote_average?.toFixed(1))} />
                    
                        { data.genres && data.genres.length > 0 && (
                        
                            data.genres.map( (genre, index) => (
                            
                                <LabelBadge key={genre.id || index} className='transparentBadge' label={genre.name} />
                            
                            ) ) 
                        
                        ) }
                    
                    </motion.div>
                
                    { mediaType === 'tv' && (
                    
                        <motion.div variants={itemVariants}>
                        
                            <h4 className='mb-2'>Episode Navigation</h4>
                        
                            <p className='text-gray-text text-sm font-Roboto-Medium mb-3'>Season {seasonSelected || 1} <span className='hidden sm:inline text-gray-text'>•</span> Episode {episodeSelected || 1} of {data[`season/${seasonSelected}`]?.episodes?.length}</p>
                        
                            <div className='border border-white-border rounded-md grayBtn-base p-4 backdrop-blur-sm space-y-3'>
                            
                                <h4 className='font-Roboto-Bold text-lg'>{data[`season/${seasonSelected}`]?.episodes[episodeSelected - 1]?.name}</h4>
                            
                                <p className='text-white/70'>{data[`season/${seasonSelected}`]?.episodes[episodeSelected - 1]?.overview}</p>
                            
                                <div className="flex-between flex-wrap">
                                
                                    <div className="flex items-center flex-wrap gap-3">
                                    
                                        <Button label='Previous' firstIcon={faStepBackward} buttonClassName='disabledBtn gap-5' />
                                    
                                        <Button label='Next' secondIcon={faStepForward} buttonClassName='disabledBtn backdrop-blur-none opacity-100 gap-5' />
                                    
                                        <Button label='Auto Next' firstIcon={faCirclePlay} buttonClassName='disabledBtn backdrop-blur-none opacity-100 gap-5'> 
                                        
                                            <span className="text-gray-text">OFF</span>
                                        
                                        </Button>
                                    
                                    </div>
                                
                                    <p className='text-gray-text mt-2 md:m-0'>Aired: {data[`season/${seasonSelected}`]?.episodes[episodeSelected - 1]?.air_date.replaceAll('-', '/').replace(/(\d{4})\/(\d{2})\/(\d{2})/, "$2/$3/$1")}</p>
                                
                                    
                                
                                </div>
                            
                            </div>
                        
                        </motion.div>
                    
                    ) }
                
                    <motion.div variants={itemVariants} className='grayBtn-base rounded-lg p-1 overflow-hidden'>
                    
                        <ul className="flex items-center gap-1">
                        
                            { mediaType === 'movie' ? ['Comments', 'Rec.', 'Similar'].map( (cate, index) => (
                            
                                <li key={index}>
                                
                                    <Button 
                                        buttonClassName={`text-white ${details === cate ? `bg-night-base` : `bg-transparent`} rounded-sm py-1 px-10 text-[14px] transition-colors duration-300 `} 
                                        label={cate}
                                        onClick={ () => setDetails(cate) }/>
                                
                                </li>
                            
                            ) ) : ['Playlist', 'Comments', 'Rec.', 'Similar'].map( (cate, index) => (
                            
                                <li key={index}>
                                
                                    <Button 
                                        buttonClassName={`text-white ${details === cate ? `bg-night-base` : `bg-transparent`} rounded-sm py-1 px-10 text-[14px] transition-colors duration-300 `} 
                                        label={cate}
                                        onClick={ () => setDetails(cate) }/>
                                
                                </li>
                            
                            ) ) }
                        
                        </ul>
                    
                    </motion.div>
                
                    { details && details === 'Playlist' && (
                    
                        <div className="grid sm:grid-cols-1 lg:grid-cols-6 gap-y-8 lg:gap-8">
                        
                            <div className="order-2 lg:order-1 col-span-12 lg:col-span-2 w-full">
                            
                                <div className="border border-white-border rounded-md p-4 space-y-4 h-175">
                                
                                    <h2 className='text-2xl font-Roboto-Bold'> <span className='relative mr-3'><FontAwesomeIcon icon={faBars} className='text-sm' /> <FontAwesomeIcon icon={faPlay} className='absolute bottom-1 right-0 text-[10px]'/> </span> Select Episode</h2>
                                
                                    <Dropdown className='w-full rounded-sm border-white-border' 
                                        options={ data?.number_of_seasons ? Array.from({ length: data.number_of_seasons }, (_, index) => `Season ${index + 1}`) : [] } 
                                        selectedOption={`Season ${seasonSelected}`}
                                        onSelect={ (season: string) => {
                                            setSeasonSelected(parseInt(season.replace("Season ", ''), 10))
                                            setEpisodeSelected(1)
                                        } }
                                    />
                                
                                    { Episodes.length > 0 && (
                                    
                                        <Dropdown className='w-full rounded-sm border-white-border' 
                                            options={ Episodes.map( (episode: any) => `Episode ${episode.episode_number}: ${episode.name}` ) } 
                                            selectedOption={Episodes[episodeSelected - 1] ? `Episode ${episodeSelected}: ${Episodes[episodeSelected - 1].name}` : `Episode ${episodeSelected}`}
                                            onSelect={ (episode: string) => {  
                                                const match = episode.match(/Episode (\d+):/);
                                                if (match) setEpisodeSelected(parseInt(match[1], 10))
                                                } }
                                        />
                                    
                                    ) }
                                
                                    <h3 className='capitalize text-xl font-Roboto-Bold'>Show Details</h3>
                                
                                    <ul className='space-y-2'>
                                    
                                        <li className="flex-between">
                                        
                                            <h4 className='text-gray-text capitalize text-sm'>Total Seasons:</h4>
                                        
                                            <span className='text-[14px]'>{data?.number_of_seasons}</span>
                                        
                                        </li>
                                    
                                        <li className="flex-between">
                                        
                                            <h4 className='text-gray-text capitalize text-sm'>Episodes in this season:</h4>
                                        
                                            <span className='text-[14px]'>{Episodes?.length}</span>
                                        
                                        </li>
                                    
                                        <li className="flex-between">
                                        
                                            <h4 className='text-gray-text capitalize text-sm'>First Aired:</h4>
                                        
                                            <span className='text-[14px]'>{data?.first_air_date.replaceAll('-', '/').replace(/(\d{4})\/(\d{2})\/(\d{2})/, "$2/$3/$1")}</span>
                                        
                                        </li>
                                    
                                        <li className="flex-between">
                                        
                                            <h4 className='text-gray-text capitalize text-sm'>Episodes:</h4>
                                        
                                            <span className='text-[14px]'>{data?.number_of_episodes}</span>
                                        
                                        </li>
                                    
                                        <li className="flex-between">
                                        
                                            <h4 className='text-gray-text capitalize text-sm'>Episode Length:</h4>
                                        
                                            <span className='text-[14px]'>{Episodes[episodeSelected - 1] ? `${Episodes[episodeSelected - 1]?.runtime}` : '-'} min</span>
                                        
                                        </li>
                                    
                                        <li className="flex-between">
                                        
                                            <h4 className='text-gray-text capitalize text-sm'>Language:</h4>
                                        
                                            <span className='text-[14px] capitalize'>{data?.original_language}</span>
                                        
                                        </li>
                                    
                                        <li className="flex-between">
                                        
                                            <h4 className='text-gray-text capitalize text-sm'>Status:</h4>
                                        
                                            <span className='text-[14px]'>{data?.status}</span>
                                        
                                        </li>
                                    
                                        <li className="flex-between">
                                        
                                            <h4 className='text-gray-text capitalize text-sm'>Type:</h4>
                                        
                                            <span className='text-[14px]'>{data?.type}</span>
                                        
                                        </li>
                                    
                                    </ul>
                                
                                </div>
                            
                            </div>
                        
                            <div className="order-1 lg:order-2 col-span-12 lg:col-span-4 w-full">
                            
                                <div className="w-full min-w-0 border border-white-border rounded-md p-4 space-y-4 h-175 overflow-hidden flex flex-col">
                                
                                    <div className="lg:flex-between flex-wrap shrink-0">
                                    
                                        <h4 className='font-Roboto-SemiCondensed-Bold text-2xl mb-5'>Episodes <span className='text-white bg-zinc-deep text-[13px] py-0.5 px-2 rounded-md'>{Episodes?.length}</span></h4>
                                    
                                        <div className="flex flex-wrap items-baseline md:gap-6 space-y-5">
                                        
                                            <InputField type='search' 
                                                placeholder='Search episodes...' 
                                                inputClassName='w-fit md:w-full lg:w-fit px-3 placeholder:text-[14px]' 
                                                value={searchEpisode} 
                                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchEpisode(e.target.value) }/>
                                        
                                            <div className='flex items-center gap-6'>
                                            
                                                <span className={`inline-block ${episodeStyle === 'individual' && "bg-zinc-deep/50"} rounded-md p-2 cursor-pointer`}
                                                    onClick={ () => setEpisodeStyle('individual') }
                                                >
                                                
                                                    <FontAwesomeIcon icon={faList} />
                                                
                                                </span>
                                            
                                                <span className={`inline-block ${episodeStyle === 'group' && "bg-zinc-deep/50"} rounded-md p-2 cursor-pointer`}
                                                    onClick={ () => setEpisodeStyle('group') }
                                                >
                                                
                                                    <FontAwesomeIcon icon={faTableCells} className='text-md' />
                                                
                                                </span>
                                            
                                            </div>
                                        
                                        </div>
                                    
                                    </div>
                                    
                                    <div className={`overflow-y-scroll [&::-webkit-scrollbar]:width-1.5 [&::-webkit-scrollbar-thumb]:bg-white-border [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar]:w-2 min-h-0 p-2 md:p-4`}>
                                    
                                        <ul className={` ${episodeStyle === 'individual' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'} `}>
                                        
                                            { filteredEpisodes && filteredEpisodes.length > 0 ? (
                                            
                                                filteredEpisodes.map( (episode: TMDBEpisode, index: number) => (
                                                
                                                    episodeStyle === "individual" ? (
                                                    
                                                        <li key={index} 
                                                            className='block md:flex items-center gap-2 border border-white-border rounded-md p-4 group transition duration-300 hover:bg-zinc-deep/50 overflow-hidden cursor-pointer'
                                                            onClick={ () => setEpisodeSelected(episode.episode_number) }>
                                                        
                                                            <div className="relative h-28 md:h-16 w-full md:w-28 shrink-0 rounded-sm overflow-hidden">
                                                            
                                                                <img src={`${TMDB_IMAGE_BASE}${episode.still_path}`} alt={episode.name} className='object-cover size-full' loading='lazy' />
                                                            
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 transition duration-300 group-hover:opacity-100"></div>
                                                            
                                                                <span className='absolute left-1/2 top-1/2 -translate-1/2 flex-center bg-black p-2 rounded-full z-10 opacity-0 duration-300 group-hover:opacity-100'><FontAwesomeIcon icon={faPlay} className='text-[12px]' /></span>
                                                            
                                                            </div>
                                                        
                                                            <div className='min-w-0 w-full overflow-hidden'>
                                                            
                                                                <div className="flex-between flex-wrap mt-2 md:mb-2 w-full">
                                                                
                                                                    <div className='font-Roboto-Condensed-Bold'>
                                                                    
                                                                        <span className='text-white bg-zinc-deep text-[13px] py-0.5 px-2 rounded-md'>
                                                                        
                                                                            EP {episode.episode_number} 
                                                                        
                                                                        </span>
                                                                    
                                                                        { episodeSelected === episode.episode_number && (
                                                                        
                                                                            <span className='bg-white text-black py-1 px-2 text-[12px] rounded-full'>Playing</span>
                                                                        
                                                                        ) }
                                                                    
                                                                    </div>
                                                                
                                                                    <div className="flex items-center gap-3">
                                                                    
                                                                        <span className='text-[14px] text-gray-text'><FontAwesomeIcon icon={faStarRegular} className='mr-1 text-brand-yellow' />{episode.vote_average}</span>
                                                                    
                                                                        <span className='text-[14px] text-gray-text'><FontAwesomeIcon icon={faClock} className='mr-1' />{episode.runtime} min</span>
                                                                    
                                                                    </div>
                                                                
                                                                </div>
                                                            
                                                                <h2 className='text-md xl:text-[17px]'>{episode.name}</h2>
                                                            
                                                                <p className='truncate whitespace-pre-wrap text-gray-text text-sm xl:text-[16px]'>{episode.overview}</p>
                                                            
                                                            </div>
                                                        
                                                        </li>
                                                    
                                                    ) : (
                                                    
                                                        <div className="col-span-1 w-full">
                                                        
                                                            <div className="relative w-full h-full rounded-md overflow-hidden cursor-pointer"
                                                                onClick={ () => setEpisodeSelected(episode.episode_number) }>
                                                            
                                                                <img src={`${TMDB_IMAGE_BASE}${episode.still_path}`} alt={episode.name} loading='lazy' className='size-full object-cover' />
                                                            
                                                                <div className="absolute inset-0 bg-black/30"></div>
                                                            
                                                                <span className="absolute left-1/2 top-1/2 -translate-1/2 bg-transparent border-2 border-white p-2 rounded-full z-10">
                                                                
                                                                    <FontAwesomeIcon icon={faPlay} className='text-white'/>
                                                                
                                                                </span>
                                                            
                                                                <h3 className="absolute left-3 bottom-2 text-md font-Roboto-SemiBold">{episode.name} <span className='text-brand-blue'>{episode.season_number}-{episode.episode_number}</span> </h3>
                                                            
                                                            </div>
                                                        
                                                        </div>
                                                    
                                                    ) 
                                                
                                                ) )
                                            
                                            ) : (
                                            
                                                <div className="text-center py-24 space-y-4">
                                                
                                                    <span className='inline-block'><FontAwesomeIcon icon={faVideoSlash} className='text-gray-text text-[60px]'/></span>
                                                
                                                    <h4 className='text-white text-lg font-Inter_18pt-SemiBold'>No Episodes Yet</h4>
                                                
                                                    <p className='text-gray-text text-sm'>Will be added soon!</p>
                                                
                                                </div>
                                            
                                            ) }
                                        
                                        </ul>
                                    
                                    </div>
                                
                                </div>
                            
                            </div>
                        
                        </div>
                    
                    ) }
                
                    { details && details === 'Comments' && (
                    
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
                                        
                                            <div className="absolute top-5 left-0 right-auto min-[425px]:left-auto min-[425px]:right-0 w-36 bg-night-base border border-white-border p-1 rounded-md"
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
                
                    { details && details === 'Rec.' && (
                    
                        <>
                        
                            <h4 className='text-[20px] mt-3 mb-10 font-Roboto-SemiBold'>Recommended for you</h4>
                        
                            { recommendationData && recommendationData.length > 0 && (
                            
                                <CardGrid items={recommendationData} mediaType={mediaType} loading={isLoading} className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-2' />
                            
                            ) }
                        
                        </>
                    
                    ) }
                
                    { details && details === 'Similar' && (
                    
                        <>
                        
                            <h4 className='text-[20px] mt-3 mb-10 font-Roboto-SemiBold'>Similar Movies</h4>
                        
                            { similarData && similarData.length > 0 ? (
                            
                                <CardGrid items={similarData} mediaType={mediaType} loading={isLoading} className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-2' />
                            
                            ) : (
                            
                                <div className="text-center py-24 space-y-4">
                                
                                    <span className='inline-block bg-black/30 rounded-full p-4'><FontAwesomeIcon icon={faPlay} className='text-gray-text text-[40px]'/></span>
                                
                                    <h4 className='text-white text-lg font-Inter_18pt-SemiBold'>No Similar Content</h4>
                                
                                    <p className='text-gray-text text-sm'>No similar movies are available at the moment.</p>
                                
                                </div>
                            
                            ) }
                        
                        </>
                    
                    ) }
                
                </motion.div>
            
                <motion.div className="w-full xl:w-75 shrink-0 space-y-6" 
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}>
                
                    <motion.div variants={itemVariants}  className="image rounded-lg overflow-hidden w-full">
                    
                        <img src={`${data?.poster_path?.length > 0 ? `${TMDB_IMAGE_BASE}${data?.poster_path}` : `${posterImage}`}`} alt={`${data?.name || data?.title}`} title={data?.name} className='w-full' loading='lazy' />
                    
                    </motion.div>
                
                    <motion.div variants={itemVariants} className="grid gap-3">
                    
                        <div className="flex flex-col">
                        
                            <Button link to={`/details/${mediaType}/${data.id}/${data.name || data.title}`} buttonClassName='grayBtn-base grayBtn-hover mt-8 px-6' label="Back to Details" firstIcon={faArrowLeft} firstIconClassName='mr-2' />
                        
                        </div>
                    
                        <div className="flex flex-col">
                        
                            <Button buttonClassName='grayBtn-base grayBtn-hover mt-2 px-6 group' type='button' label="Added to Favorites" firstIcon={faHeartRegular} firstIconClassName='mr-2 transition-colors duration-200 group-hover:text-red' />
                        
                        </div>
                    
                        <div className="flex flex-col">
                        
                            <Button buttonClassName='grayBtn-base grayBtn-hover mt-2 px-6 group' type='button' label="Added to Wishlist" firstIcon={faBookmarkRegular} firstIconClassName='mr-2 transition-colors duration-200 group-hover:text-yellow' />
                        
                        </div>
                    
                    </motion.div>
                
                    <motion.div variants={itemVariants} className="mt-8 mb-0 grayBtn-base w-full overflow-hidden">
                    
                        <div className="p-6">
                        
                            <h4 className="label-card">{data?.name}</h4>
                        
                            <div className="my-4 flex flex-wrap items-center gap-2">
                            
                                <div className="yellowBadge">
                                
                                    <span className="mr-1">IMDB</span>
                                
                                    <span>{data?.rating}</span>
                                
                                </div>
                            
                                <LabelBadge className='spaceBlueBadge' label='PG' />
                            
                                <LabelBadge className='spaceBlueBadge' label='2019' />
                            
                            </div>
                        
                            <p className="desc-base mt-6">{data?.overview}
                            </p>
                        
                            <div className="h-1 w-full bg-gray-800 mt-6"></div>
                        
                            <div className="text-sm mt-6">
                            
                                { data.production_countries && data.production_countries.length > 0 && (
                                
                                    <div className="grid grid-cols-[100px_1fr] gap-2 mt-2">
                                    
                                        <span className="text-gray-400">Country:</span>
                                    
                                        <span className="text-white font-Inter_18pt-Bold">{data.production_countries.map(country => country.name).join(', ')}</span> 
                                    
                                    </div>
                                
                                ) }
                            
                                { data.genres && data.genres.length > 0 && (
                                
                                    <div className="grid grid-cols-[100px_1fr] gap-2 mt-2">
                                    
                                        <span className="text-gray-400">Genres:</span>
                                        
                                        <span className="text-white font-Inter_18pt-Bold">{data?.genres?.map(genre => genre.name).join(', ')}</span>
                                    
                                    </div>
                                
                                ) }
                            
                                <div className="grid grid-cols-[100px_1fr] gap-2 mt-2">
                                
                                    <span className="text-gray-400">Released:</span>
                                
                                    <span className="text-white font-Inter_18pt-Bold">{mediaType === 'movie'? data?.release_date : data?.first_air_date}</span>
                                
                                </div>
                            
                                { data.production_companies && data.production_companies.length > 0 && (
                                
                                    <div className="grid grid-cols-[100px_1fr] gap-2 mt-2">
                                    
                                        <span className="text-gray-400">Productions:</span>
                                    
                                        <span className="text-white font-Inter_18pt-Bold">{data?.production_companies?.map( company => company.name ).join(', ')}</span>
                                    
                                    </div>
                                
                                ) }
                            
                            </div>
                        
                        </div>
                    
                        <div className="flex-center gap-1 p-4 bg-blue">
                        
                            { data?.vote_average && (
                            
                                <div className="flex gap-0.5">
                                
                                    {[...Array(5)].map( (_: unknown, index) => ( 
                                    
                                        <span key={index}>
                                            <FontAwesomeIcon icon={faStar} className={`text-[18px] ${(data?.vote_average ?? 0) / 2 > index + 1 ? 'text-black' : 'text-gray'}`} />
                                        </span>
                                    
                                    ) )}
                                
                                </div>
                            
                            ) }
                        
                            <div className='text-white text-lg'>
                            
                                <span className="font-Inter_18pt-Bold text-2xl">{data?.vote_average?.toFixed(1)}</span>
                            
                                <span className="opacity-80 text-sm ml-1">
                                
                                    of 10 (
                                
                                    {data?.vote_count}
                                
                                    <br />voted)
                                
                                </span>
                            
                            </div>
                        
                        </div>
                    
                    </motion.div>
                
                </motion.div>
            
            </div>
        
        </div>
    
    )

}

export default CardDetailsSidebar;