import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchFromTmdb, fetchEnrichedMediaList } from '@/Services/API/tmdb';
import CardGrid from '@/components/CardGrid';
import FilterSidebar, { FilterPackage } from '@/components/FilterSidebar';
import Button from '@/components/UI/Button';
import Pagination from '@/components/UI/Pagination';
import { faSliders, faXmark } from '@fortawesome/free-solid-svg-icons';

const KEY = import.meta.env.VITE_TMDB_KEY;

const SearchResults = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const searchQuery = searchParams.get('query') || '';

    const [page, setPage] = useState<number>(1);
    const [allPages, setAllPages] = useState<number>(1);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [contentList, setContentList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

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
    }, [searchQuery]);

    useEffect(() => {
        const fetchingSearchData = async () => {
            if (!searchQuery) return;
            setIsLoading(true);

            try {
            
                const apiEndpoint = `/search/multi`;
                let queryParams = `?api_key=${KEY}&query=${encodeURIComponent(searchQuery)}&language=en-US&include_adult=false&page=${page}`;
            
                const data = await fetchFromTmdb(`${apiEndpoint}${queryParams}`);
            
                setAllPages(data.total_pages || 1);
                setTotalResults(data.total_results || 0);
            
                if (data.results) {
                    
                    const filteredSafeMedia = data.results.filter((item: any) => {
                        if (item.adult) return false;
                        
                        const title = (item.title || item.name || "").toLowerCase();
                        const overview = (item.overview || "").toLowerCase();
                        const blockedKeywords = [
                            "erotic", "sensual", "sexy", "unrated", "playboy", 
                            "harlot", "escort", "nudity", "softcore", "desire",
                            "lust", "mistress", "affair", "dating", "scandalous",
                            "love"
                        ];
                        
                        return !blockedKeywords.some(word => title.includes(word) || overview.includes(word));
                    });

                    setContentList(filteredSafeMedia);
                } else {
                    setContentList([]);
                }
            } catch (err) {
                console.error("Error building search collection results matrix:", err);
                setContentList([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchingSearchData();
    }, [searchQuery, page]);

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-4xl font-bold font-Inter tracking-tight mb-2">PressPlay Search</h1>
                <p className="text-gray-400 text-lg">Find your next favorite movie, show, anime, or manga</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-800 pb-4 mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-semibold mb-1">All Content</h3>
                    <p className="text-sm text-gray-400">
                        <span className="text-emerald-400 font-medium">{totalResults} results</span> for keyword 
                        <span className="text-white italic font-semibold"> "{searchQuery}"</span> in all content
                    </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <Button 
                        link={false} 
                        onClick={() => navigate(-1)} 
                        buttonClassName="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm rounded transition flex items-center gap-2" 
                        label="Clear search" 
                        firstIcon={faXmark} 
                    />

                    <Button 
                        link={false} 
                        onClick={() => setIsFilterSidebarOpen(true)} 
                        buttonClassName="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded transition" 
                        label="Filters" 
                        firstIcon={faSliders} 
                    />
                </div>
            </div>

            <CardGrid items={contentList} loading={isLoading} />

            <Pagination 
                current={page} 
                allPages={allPages} 
                onPageChange={(newPage) => setPage(newPage)} 
            />

            <FilterSidebar 
                isOpen={isFilterSidebarOpen} 
                onClose={() => setIsFilterSidebarOpen(false)} 
                currentData={activeFilters}
                onApplyFilters={(filters) => setActiveFilters(filters)}
            />
        </div>
    );
};

export default SearchResults;