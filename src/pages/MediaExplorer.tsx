import CardGrid from '@/components/CardGrid';
import FilterSidebar, { FilterPackage } from '@/components/FilterSidebar'
import Button from '@/components/UI/Button'
import { faArrowDownShortWide, faArrowTrendDown, faArrowTrendUp, faCalendarDays, faCheck, faSliders, faThumbsDown, faThumbsUp, faUserMinus, faUserPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import React, { act, useEffect, useRef, useState } from 'react'
import { fetchFromTmdb, fetchEnrichedMediaList } from '@/Services/API/tmdb'
import Pagination from '@/components/UI/Pagination';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const KEY = import.meta.env.VITE_TMDB_KEY

const genres: {id: number, name: string,}[] = [ 

    {
        id: 28,
        name: "Action"
    },
    {
        id: 12,
        name: "Adventure"
    },
    {
        id: 16,
        name: "Animation"
    },
    {
        id: 35,
        name: "Comedy"
    },
    {
        id: 80,
        name: "Crime"
    },
    {
        id: 99,
        name: "Documentary"
    },
    {
        id: 18,
        name: "Drama"
    },
    {
        id: 10751,
        name: "Family"
    },
    {
        id: 14,
        name: "Fantasy"
    },
    {
        id: 36,
        name: "History"
    },
    {
        id: 27,
        name: "Horror"
    },
    {
        id: 10402,
        name: "Music"
    },
    {
        id: 9648,
        name: "Mystery"
    },
    {
        id: 10749,
        name: "Romance"
    },
    {
        id: 878,
        name: "Science Fiction"
    },
    {
        id: 10770,
        name: "TV Movie"
    },
    {
        id: 53,
        name: "Thriller"
    },
    {
        id: 10752,
        name: "War"
    },
    {
        id: 37,
        name: "Western"
    }

]

const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "ar", name: "Arabic" },
    { code: "fr", name: "French" }
];

const watchProviders = [
    { id: 8, name: "Netflix" },
    { id: 337, name: "Disney Plus" },
    { id: 119, name: "Amazon Prime Video" },
    { id: 350, name: "Apple TV Plus" }
];

interface SortOption {
    label: string;
    icon: IconDefinition;
    movieParam: string;
    tvParam: string;
}

const CATEGORY_SORT_OPTIONS: SortOption[] = [
    { label: 'Popularity Descending', icon: faArrowTrendUp, movieParam: 'popularity.desc', tvParam: 'popularity.desc' },
    { label: 'Popularity Ascending', icon: faArrowTrendDown, movieParam: 'popularity.asc', tvParam: 'popularity.asc' },
    { label: 'Release Date Descending', icon: faCalendarDays, movieParam: 'primary_release_date.desc', tvParam: 'first_air_date.desc' },
    { label: 'Release Date Ascending', icon: faCalendarDays, movieParam: 'primary_release_date.asc', tvParam: 'first_air_date.asc' },
    { label: 'Rating Descending', icon: faThumbsUp, movieParam: 'vote_average.desc', tvParam: 'vote_average.desc' },
    { label: 'Rating Ascending', icon: faThumbsDown, movieParam: 'vote_average.asc', tvParam: 'vote_average.asc' },
    { label: 'Vote Count Descending', icon: faUserPlus, movieParam: 'vote_count.desc', tvParam: 'vote_count.desc' },
    { label: 'Vote Count Ascending', icon: faUserMinus, movieParam: 'vote_count.asc', tvParam: 'vote_count.asc' }
];

const MediaExplorer = () => {

    const { mediaType, category = 'discover' } = useParams<{ mediaType: 'movie' | 'tv'; category: string }>();

    const [page, setPage] = useState<number>(1);
    const [allPages, setAllPages] = useState<number>(1)

    const [activeFilters, setActiveFilters] = useState<FilterPackage>({
        genres: [],
        startDate: "Select Date...",
        endDate: "Select Date...",
        language: "Selected Language...",
        provider: "Selected Providers...",
        voteAverage: 0,
        minimumVotes: 0,
    });

    useEffect(() => {
        setPage(1);
        setDefaultSort('Popularity Descending');
        setActiveFilters({
            genres: [],
            startDate: "Select Date...",
            endDate: "Select Date...",
            language: "Selected Language...",
            provider: "Selected Providers...",
            voteAverage: 0,
            minimumVotes: 0,
        });
    
        localStorage.removeItem(`${mediaType}Filters`);
    
    }, [category, mediaType]);

    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
    const [contentList, setContentList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSortOpen, setIsSortOpen] = useState<boolean>(false);

    const toggleFilterSidebar = () => {
        setIsFilterSidebarOpen(prev => !prev);
    }

    useEffect(() => {
        setPage(1);
    }, [category, mediaType]);

    const [defaultSort, setDefaultSort] = useState<string>('Popularity Descending');

    useEffect( () => {
    
        const currentActiveGenreIds = activeFilters.genres.map( (genre) => {
        
            if (mediaType === 'tv' && genre === 'Action') {
                return 10759;
            }
        
            const found = genres.find( (item) => item.name === genre )
            return found ? found.id : null;
        
        }).filter( (id): id is number => id !== null )
    
        const fetchingData = async () => {
            setIsLoading(true);
            try {
            
                let apiEndpoint = '';
                const cleanCategory = category.toLowerCase().trim();
                const cleanMediaType = mediaType.toLowerCase().trim();
                const isMovie = cleanMediaType === 'movie';
                
                if (cleanCategory === 'trending') {
                    apiEndpoint = `/trending/${cleanMediaType}/day`;
                } else if (cleanCategory === 'discover') {
                    apiEndpoint = `/discover/${cleanMediaType}`;
                } else {
                    apiEndpoint = `/${cleanMediaType}/${cleanCategory}`;
                }
            
                let queryParams = `?api_key=${KEY}&language=en-US&include_adult=false`;
            
                if (cleanCategory === 'discover') {
                
                    const currentSortConfig = CATEGORY_SORT_OPTIONS.find( item => item.label === defaultSort );
                
                    if (currentSortConfig) {
                        const targetParam = isMovie ? currentSortConfig.movieParam : currentSortConfig.tvParam;
                        const ageCertification = isMovie ? 'lte=PG-13' : 'lte=TV-14';
                        queryParams += `&sort_by=${targetParam}&certification_country=US&certification.${ageCertification}`;
                    }
                }
            
                if (currentActiveGenreIds.length > 0) {
                    queryParams += `&with_genres=${currentActiveGenreIds.join(',')}`;
                }
            
                const startParam = isMovie ? 'primary_release_date.gte' : 'first_air_date.gte';
                const endParam = isMovie ? 'primary_release_date.lte' : 'first_air_date.lte';
            
                if (activeFilters.startDate !== 'Select Date...') {
                    queryParams += `&${startParam}=${activeFilters.startDate}-01-01`;
                }
            
                if (activeFilters.endDate !== 'Select Date...') {
                    queryParams += `&${endParam}=${activeFilters.endDate}-12-31`;
                }
            
                if (activeFilters.voteAverage > 0) {
                    queryParams += `&vote_average.gte=${activeFilters.voteAverage}`;
                }
            
                // Minimum Votes Slider
                if (activeFilters.minimumVotes > 0) {
                    queryParams += `&vote_count.gte=${activeFilters.minimumVotes}`;
                }
            
                if (activeFilters.language !== "Selected Language...") {
                    const foundLanguage = languages.find(lang => lang.name === activeFilters.language);
                    if (foundLanguage) {
                        queryParams += `&with_original_language=${foundLanguage.code}`;
                    }
                }
                
                if (activeFilters.provider !== "Selected Providers...") {
                    const foundProvider = watchProviders.find(p => p.name === activeFilters.provider);
                    if (foundProvider) {
                        queryParams += `&with_watch_providers=${foundProvider.id}&watch_region=US`;
                    }
                }
            
                const baseURL = await fetchFromTmdb(`${apiEndpoint}${queryParams}`);
                const data = await fetchFromTmdb(`${apiEndpoint}${queryParams}&page=${page}`);
            
                setAllPages(baseURL.total_pages);
            
                if (data.results) {
                    const enrichedData = await fetchEnrichedMediaList(data.results);
                    
                    const completelySafeMedia = enrichedData.filter((item: any) => {
                        if (item.adult) return false;
                    
                        const title = (item.title || item.name || "").toLowerCase();
                        const overview = (item.overview || "").toLowerCase();
                    
                        const blockedKeywords = [
                            "erotic", "sensual", "sexy", "unrated", "playboy", 
                            "harlot", "escort", "nudity", "softcore", "desire",
                            "lust", "mistress", "affair", "dating", "scandalous",
                            "love"
                        ];
                        
                        const hasBlockedContent = blockedKeywords.some(word => 
                            title.includes(word) || overview.includes(word)
                        );
                        if (hasBlockedContent) return false;
                    
                        const matureGenres = [10749, 10767, 10764];
                        const hasMatureGenre = item.genre_ids?.some((id: number) => matureGenres.includes(id));
                        if (hasMatureGenre) return false;
                    
                        return true;
                    });
                
                    setContentList(completelySafeMedia);
                
                } else {
                
                    setContentList([]);
                
                }
            
            } catch (err) {
            
                console.log(`Error fetching context data`, err);
            
            } finally {
            
                setIsLoading(false);
            
            }
        
        }
    
        fetchingData();
    
        window.scrollTo({ top: 0, behavior: 'smooth' });
    
    }, [page, category, mediaType, activeFilters, defaultSort]) 

    const handleApplyFilters = (completedFilters: FilterPackage) => {
    
        setActiveFilters(completedFilters);
    
    }

    const sortByRef = useRef<HTMLDivElement>(null)

    useEffect( () => {
    
        const handleClickOutside = (event: MouseEvent) => {
        
            const target = event.target as Node;
        
            if (sortByRef.current && !sortByRef.current.contains(target)) {
                setIsSortOpen(false)
            }
        
        }
    
        if (isSortOpen) {
        
            window.document.body.style.overflow = 'hidden';
            window.document.body.style.touchAction = 'none';
            window.addEventListener("mousedown", handleClickOutside)
        
        } else {
        
            window.removeEventListener("mousedown", handleClickOutside)
            window.document.body.style.overflow = 'auto';
            window.document.body.style.touchAction = 'auto';
        
        }
    
        return () => {
        
            window.removeEventListener("mousedown", handleClickOutside)
            window.document.body.style.overflow = 'auto';
            window.document.body.style.touchAction = 'auto';
        
        }
    
    }, [isSortOpen] )

    return (
        <>
            <div className="container mx-auto px-2 py-8 sm:px-4 pt-24">
            
                <div className='mb-6'>
                
                    <h4 className='capitalize mb-4 text-2xl font-Inter_18pt-Medium'>
                    
                        { category } { mediaType === 'movie' ? 'Movies' : 'TV Shows' }
                    
                    </h4>
                
                    { mediaType === 'movie' ? (
                    
                        <p className='text-gray-text'>
                        
                            Find movies by genre, rating, year, and more. Use the filters and sorting options to explore <br />
                        
                            TMDB’s vast movie collection.
                        
                        </p>
                    
                    ) : (
                    
                        <p className='text-gray-text'>
                        
                            Find TV shows by genre, rating, year, and more. Use the filters and sorting options to explore <br />
                        
                            TMDB’s vast TV show collection.
                        
                        </p>
                    
                    ) }
                
                </div>
            
                <div className="flex items-center gap-2 justify-end mb-6">
                
                    <div className="flex items-center gap-3">
                    
                        <Button link={false} onClick={toggleFilterSidebar} buttonClassName='transparentBtn-base transparentBtn-hover capitalize' label='filters' firstIcon={faSliders} />
                    
                        <FilterSidebar 
                            key={`${mediaType}-${category}`}
                            isOpen={isFilterSidebarOpen} 
                            onClose={toggleFilterSidebar} 
                            currentData={activeFilters}
                            onApplyFilters={handleApplyFilters}
                            mediaType={mediaType}
                            />
                    
                    </div>
                    
                    <div className='relative'>
                    
                        <Button link={false} onClick={ () => setIsSortOpen(!isSortOpen) } buttonClassName='transparentBtn-base transparentBtn-hover capitalize' label='Sort by' firstIcon={faArrowDownShortWide} />
                    
                        <div 
                            className={`absolute right-0 top-12 w-80 p-2 bg-night-base rounded-lg border border-white/10 transition-all duration-300 z-999 ${isSortOpen ? `opacity-100 visible`: `opacity-0 invisible`} `}
                            ref={sortByRef}
                        >
                        
                            <ul>
                            
                                { CATEGORY_SORT_OPTIONS.map( (sortBy, index) => (
                                    
                                        <li 
                                            key={index} 
                                            className={`flex items-center justify-between w-full mb-1 border-none transparentBtn-base font-Inter_18pt-Medium capitalize text-[14px] pe-2 transition-colors duration-300 ${sortBy.label === defaultSort ? `whiteBtn-base whiteBtn-hover` : `transparentBtn-hover`}`}
                                            onClick={ () => { setDefaultSort(sortBy.label); setIsSortOpen(false); } }
                                            >
                                        
                                            <Button 
                                                label={sortBy.label} 
                                                buttonClassName={``} 
                                                firstIcon={sortBy.icon}
                                                />
                                        
                                            <span> <FontAwesomeIcon icon={ sortBy.label === defaultSort && faCheck } /> </span>
                                        
                                        </li>
                                    
                                    ) ) }
                            
                            </ul>
                        
                        </div>
                    
                    </div>
                
                </div>
            
                <CardGrid items={contentList} mediaType={mediaType} loading={isLoading} />
            
                <Pagination 
                    current={page} 
                    allPages={allPages} 
                    onPageChange={(newPage) => setPage(newPage)} 
                />
            
            </div>
        
        </>
    
    )

}

export default MediaExplorer;