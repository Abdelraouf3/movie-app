import CardDetailsSidebar from '@/components/CardDetailsSidebar'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchFromTmdb, fetchTvShowWithEpisodes } from '@/Services/API/tmdb'
import Loader from '@/components/UI/Loader';

const KEY = import.meta.env.VITE_TMDB_KEY;

const Watch = () => {

    const { mediaType = 'movie', mediaId, mediaName } = useParams<{ mediaType: 'movie' | 'tv'; mediaId: string; mediaName: string; }>();

    const [media, setMedia] = useState<{}>()

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect( () => {
    
        if (!mediaId) return;
    
        const fetchMediaData = async () => {
        
            setIsLoading(true);
        
            try {
            
                const cleanId = parseInt(mediaId, 10); 
            
                if ( isNaN(cleanId) ) return;
            
                if (mediaType === 'movie') {
                
                    const data = await fetchFromTmdb(`/${mediaType}/${mediaId}?api_key=${KEY}&language=en-US`);
                
                    setMedia(data || null);
                
                } else {
                
                    const data = await fetchTvShowWithEpisodes(cleanId);
                
                    setMedia(data || null);
                
                }
            
            }
        
            catch (err) {
            
                console.log(`Error fetching ${mediaType} data: `, err);
            
            } finally {
            
                setIsLoading(false);
            
            }
        
        }
    
        fetchMediaData();
    
    }, [mediaType, mediaId] )

    if (isLoading) {
    
        return (
        
            <div className="relative min-h-100 w-full">
            
                <Loader isFullPage={false} />
            
            </div>
        
        );
    
    }

    return (
    
        <>
        
            <div className="container mx-auto px-2 py-8 sm:px-4 pt-24">
            
                <CardDetailsSidebar mediaType={mediaType} data={media} mediaId={mediaId} />
            
            </div>
        
        </>
    
    )

}

export default Watch