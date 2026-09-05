import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import Button from './UI/Button'
import Dropdown from './UI/Dropdown'

export interface FilterPackage {
    genres: string[];
    startDate: string;
    endDate: string;
    language: string;
    provider: string;
    voteAverage: number;
    minimumVotes: number;
}

interface FilterSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    mediaType?: 'movie' | 'tv'
    currentData?: FilterPackage;
    onApplyFilters?: (updateFilters: FilterPackage) => void;
}

const genres: string[] = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"]

const languages: string[] = [
    "selected language..", "English", "Spanish", "French", "Germen", "Italian", "Japanese", "Korean", "Chinese", "Russian", "Hindi", "Portuguese", "Arabic", "Turkish", "Polish", "Swedish", "Dutch", "Danish", "Finnish", "Norwegian",
    "Thai", "Ukrainian", "Hebrew", "Czech", "Hungarian", "Romanian", "Greek", "Bulgarian", "Croatian", "Slovak", "Slovenian", "Estonian", "Latvian", "Lithuanian", "Vietnamese", "Indonesian", "Malay", "Persian", "Urdu", "Bengali", 
    "Tamil", "Telugu", "Malayalam", "Kannada", "Gujarati", "Marathi", "Punjabi", "Nepali", "Sinhala"]

const providers: string[] = ["selected providers..", "Netflix", "Amazon Prime Video", "Disney Plus", "Hulu", "HBO Max", "Apple TV Plus", "Paramount Plus", "Peacock", "Youtube", "Apple iTunes"]


const FilterSidebar = ( { isOpen, onClose, mediaType = "movie", currentData, onApplyFilters }: FilterSidebarProps ) => {

    const filterBoxRef = useRef(null);

    const storagePrefix = mediaType === "movie" ? "movie" : "tv";

    const defaultFilters = {
        genres: [],
        startDate: "Select Date...",
        endDate: "Select Date...",
        language: "Selected Language...",
        provider: "Selected Providers...",
        voteAverage: 0,
        minimumVotes: 0,
    };

    const [filters, setFilters] = useState(() => {
        const saved = localStorage.getItem(
            `${storagePrefix}Filters`
        );

        return saved
            ? JSON.parse(saved)
            : currentData;
    });

    useEffect( () => {
    
        if (currentData) {
            setFilters(currentData);
        }
    
    }, [currentData] )

    const updateFilter = (key: string, value: string | number) => {
        const updated = { ...filters, [key]: value };
        setFilters(updated);
        onApplyFilters(updated);
    };

    const toggleGenre = (genre: string) => {
        const updatedGenres = filters.genres.includes(genre)
            ? filters.genres.filter(g => g !== genre)
            : [...filters.genres, genre];

        updateFilter("genres", updatedGenres);    };

        const startYears = [
        "Select Date...",
        ...Array.from(
            {
                length:
                    new Date().getFullYear() -
                    1947 +
                    1,
            },
            (_, i) => new Date().getFullYear() - i
        ),
    ];
    
    const currentYear = new Date().getFullYear();
    
    const endYears = [
        "Select Date...",
        ...Array.from(
            {
                length:
                    filters.startDate ===
                    "Select Date..."
                        ? currentYear - 1947 + 1
                        : currentYear -
                            Number(filters.startDate) +
                            1,
            },
            (_, i) => currentYear - i
        ),
    ];

    const saveFiltersChanges = () => {
        localStorage.setItem(
            `${storagePrefix}Filters`,
            JSON.stringify(filters)
        );

        onApplyFilters(filters);

        onClose();
    };

    const clearFilters = () => {
        setFilters( {...defaultFilters} );
        localStorage.removeItem(`${storagePrefix}Filters`);
        onApplyFilters(defaultFilters);
    };

    if (!isOpen) {
        return null;
    }

    return (
    
        <>
        
            <div ref={filterBoxRef} className='w-full'>
            
                <div onClick={onClose} className="fixed inset-0 min-w-full min-h-full bg-black/80 z-999 cursor-pointer"></div>
            
                <div className="fixed right-0 top-0 bottom-0 h-full w-3/4 md:w-[40%] lg:w-[35%] xl:w-[25%] z-9999 bg-night-base p-6">
                
                    <div className="absolute right-1 top-4 z-99999">
                    
                        <Button onClick={onClose} buttonClassName='p-0' label='' firstIcon={faClose} firstIconClassName='text-white text-[20px]' />
                    
                    </div>
                
                    <h4 className="title-card text-white">Filters</h4>
                
                    <p className="desc-base mt-3 text-[14px] text-ui-ring">Narrow down your search results with the following filters.</p>
                
                    <h4 className="capitalize text-ui-ring text-[14px]">genres</h4>
                
                    <ul className='flex items-center flex-wrap gap-x-1 gap-y-3 mt-4'>
                    
                        { [...Array(19)].map( (_, index)  => (
                        
                            <li key={index}>
                            
                                <Button key={index + 1} onClick={ () => toggleGenre(genres[index]) } 
                                    buttonClassName={`rounded-full py-0.5 px-2.5 text-[12px] font-Inter_28pt-Bold capitalize ${filters.genres.includes(genres[index]) ? `bg-white text-black` : `bg-ui-muted text-white` }`} 
                                    label={`${genres[index]}`} />
                            
                            </li>
                        
                        ) ) }
                    
                    </ul>
                
                    <div className="flex flex-wrap md:flex-nowrap gap-4 my-4">
                    
                        <div className="w-full md:flex-1">
                        
                            <span className='capitalize text-[14px] text-gray-400 mb-1 block'>from</span>
                        
                            <Dropdown variant='filter' className='w-full' options={startYears} selectedOption={filters.startDate} onSelect={ (year: string) => updateFilter("startDate", year) } />
                        
                        </div>
                    
                        <div className="w-full md:flex-1">
                        
                            <span className='capitalize text-[14px] text-gray-400 mb-1 block'>to</span>
                        
                            <Dropdown variant='filter' className='w-full' options={endYears} selectedOption={filters.endDate} onSelect={ (year: string) => updateFilter("endDate", year) } />
                        
                        </div>
                    
                    </div>
                
                    <div className='w-full'>
                    
                        <span className='capitalize text-[14px] text-gray-400 mb-1 block'>language</span>
                    
                        <Dropdown variant='filter' className={'w-full'} options={languages} selectedOption={filters.language} onSelect={ (language: string) => updateFilter("language", language) } />
                    
                    </div>
                
                    <div className='w-full mt-5'>
                    
                        <span className='capitalize text-[14px] text-gray-400 mb-1 block'>where to watch</span>
                    
                        <Dropdown variant='filter' className={'w-full'} options={providers} selectedOption={filters.provider} onSelect={ (provider: string) => updateFilter("provider", provider) } />
                    
                    </div>
                
                    <div className="w-full mt-5">
                    
                        <span className='capitalize text-[14px] text-gray-400 mb-1 block'>vote average</span>
                    
                        <input type="range" className='w-full block range accent-white' name="voteAverage" id="voteAverage" step={1} min={0} max={10} value={filters.voteAverage} onChange={ (e) => updateFilter("voteAverage", Number(e.target.value)) } />
                    
                        <div className="mt-4 flex justify-between border-t">
                        
                            { [...Array(11)].map( (_, votes) => (
                            
                                <div className={`relative pt-2`} key={votes + 1}>
                                
                                    <span className="text-[9px] text-gray-text">{votes + 1 - 1}</span>
                                
                                    <span className="absolute left-1/2 top-0 block h-1/3 w-px -translate-x-px bg-ui-muted"></span>
                                
                                </div>
                            
                            ) ) }
                        
                        </div>
                    
                    </div>
                
                    <div className="w-full mt-5">
                    
                        <span className='capitalize text-[14px] text-gray-400 mb-1 block'>minimum votes</span>
                    
                        <input type="range" className='w-full block range accent-white' name="minimumVotes" id="minimumVotes" step={10} min={0} max={500} value={filters.minimumVotes} onChange={ (e) => updateFilter("minimumVotes", Number(e.target.value)) } />
                    
                        <div className="mt-4 flex justify-between border-t">
                        
                            { [...Array(11)].map( (_, index) => (
                            
                                <div className={`relative ml-${5 * index} pt-2`} key={index + 1}>
                                
                                    <span className="text-[9px] text-gray-text">{index * 50}</span>
                                
                                    <span className="absolute left-1/2 top-0 block h-1/3 w-px -translate-x-px bg-ui-muted"></span>
                                
                                </div>
                            
                            ) ) }
                        
                        </div>
                    
                    </div>
                
                    <div className="mt-8 flex-end gap-4">
                    
                        <Button buttonClassName={'transparentBtn-base transparentBtn-hover px-8'} label='clear' onClick={clearFilters} />
                    
                        <Button buttonClassName={'whiteBtn-base whiteBtn-hover'} label='save changes' onClick={saveFiltersChanges} /> 
                    
                    </div>
                
                </div>
            
            </div>
        
        </>
    
    )

}

export default FilterSidebar