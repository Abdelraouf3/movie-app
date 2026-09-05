import React, { useEffect, useState } from 'react'
import HeroBanner from '../components/HeroBanner'
import CardGrid from '../components/CardGrid'
import Button from '../components/UI/Button'
import { fetchFromTmdb, fetchEnrichedMediaList } from '@/Services/API/tmdb'
import Loader from '@/components/UI/Loader'

const KEY = import.meta.env.VITE_TMDB_KEY;

const Home = () => {

    const [trendingTab, setTrendingTab] = useState<"Movies" | "TV Shows">("Movies");
    const [contentTrendingList, setContentTrendingList] = useState<(any)[]>([]);
    const [contentLatestMoviesList, setContentLatestMoviesList] = useState<(any)[]>([]);
    const [contentLatestTVList, setContentLatestTVList] = useState<(any)[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    useEffect(() => {
    
        const fetchTrendingData = async () => {
        
            setIsLoading(true);
        
            const mediaTypePath = trendingTab === 'Movies' ? 'movie' : 'tv'
        
            try {
            
                const rowData = await fetchFromTmdb(`/trending/${mediaTypePath}/week`);
            
                if (rowData.results) {
                
                    const enrichedData = await fetchEnrichedMediaList(rowData.results);
                
                    setContentTrendingList(enrichedData)
                
                } else {
                
                    setContentTrendingList([]);
                
                }
            
            } catch (err) {
            
                console.log("Couldn't fetch data on Home Page", err);
            
            } finally {
            
                setIsLoading(false);
            
                setIsInitialLoad(false);
            
            }
        
        } 
    
        const fetchLatestMoviesData = async () => {
        
            setIsLoading(true);
        
            try {
            
                const data = await fetchFromTmdb(`/movie/now_playing?api_key=${KEY}&language=en-US&page=1`);
            
                if (data.results) {
                
                    setContentLatestMoviesList(data.results);
                
                } else {
                
                    setContentLatestMoviesList([]);
                
                }
            
            } catch (err) {
            
                console.log("Couldn't fetch Latest Data", err);
            
            } finally {
            
                setIsLoading(false);
            
                setIsInitialLoad(false);
            
            }
        
        }
    
        const fetchLatestTVData = async () => {
        
            setIsLoading(true);
        
            try {
            
                const data = await fetchFromTmdb(`/tv/on_the_air?api_key=${KEY}&language=en-US&page=1`);
            
                if (data.results) {
                
                    setContentLatestTVList(data.results);
                
                } else {
                
                    setContentLatestTVList([]);
                
                }
            
            } catch (err) {
            
                console.log("Couldn't fetch Latest Data", err);
            
            } finally {
            
                setIsLoading(false);
            
                setIsInitialLoad(false);
            
            }
        
        }
    
        fetchTrendingData();
    
        fetchLatestMoviesData();
    
        fetchLatestTVData();
    
    }, [trendingTab]);

    if (isInitialLoad) {
    
        return <Loader isFullPage />
    
    }

    return (
    
        <>
        
            <HeroBanner />
        
            <div className="container mx-auto px-2 sm:px-4 pt-24">
            
                <div className="mb-24">
                
                    <div className="block md:flex-between items-center mb-5">
                    
                        <div className="flex items-center gap-3 mb-8">
                        
                            <h2 className='md:text-lg'>Trending</h2>
                        
                            <div className="flex items-center-gap-2 p-1 rounded-full bg-white/5">
                            
                                <Button label='Movies' 
                                    buttonClassName={`${trendingTab === "Movies" ? `text-white bg-white/10 py-1.5 px-2.5 md:px-4 rounded-full`: `text-gray-text hover:text-white`} transition-colors duration-200 text-[12px] md:text-[14px]`} 
                                    type='button' 
                                    onClick={ () => { setTrendingTab("Movies") } }
                                    />
                            
                                <Button label='TV Shows' 
                                    buttonClassName={`${trendingTab === "TV Shows" ? `text-white bg-white/10 py-1.5 px-2.5 md:px-4 rounded-full`: `text-gray-text hover:text-white`} transition-colors duration-200 text-[12px] md:text-[14px]`}  
                                    type='button' 
                                    onClick={ () => { setTrendingTab("TV Shows") } }
                                    />
                            
                            </div>
                        
                        </div>
                    
                        <Button link internal to={`/${trendingTab === 'Movies' ? 'movie' : 'tv'}/discover`} buttonClassName='paginationBtn-base bg-night-base text-[14px] py-0 px-3 rounded-lg border border-zinc-deep hover:bg-dark-yellow hover:text-black' label='Explore more' />
                    
                    </div>
                
                    <CardGrid items={contentTrendingList} mediaType={`${trendingTab === 'Movies' ? 'movie' : 'tv'}`} loading={isLoading} isFullData={false} />
                
                </div>
            
                <div className="mb-24">
                
                    <div className="flex items-center gap-3 mb-8">
                    
                        <h2 className='md:text-lg'>Latest Movies</h2>
                    
                        <Button link internal to='/movie/discover' buttonClassName='paginationBtn-base bg-night-base text-[14px] py-0 px-3 rounded-lg border border-zinc-deep hover:bg-dark-yellow hover:text-black' label='Explore more' />
                    
                    </div>
                
                    <CardGrid items={contentLatestMoviesList} mediaType={`${trendingTab === 'Movies' ? 'movie' : 'tv'}`} loading={isLoading} isFullData={false} />
                
                </div>
            
                <div className="mb-24">
                
                    <div className="flex items-center gap-3 mb-8">
                    
                        <h2 className='md:text-lg'>Latest TV Shows</h2>
                    
                        <Button link internal to='/tv/discover' buttonClassName='paginationBtn-base bg-night-base text-[14px] py-0 px-3 rounded-lg border border-zinc-deep hover:bg-dark-yellow hover:text-black' label='Explore more' />
                    
                    </div>
                
                    <CardGrid items={contentLatestTVList} mediaType={`${trendingTab === 'Movies' ? 'movie' : 'tv'}`} loading={isLoading} isFullData={false} />
                
                </div>
            
            </div>
        
        </>
    
    )

}

export default Home