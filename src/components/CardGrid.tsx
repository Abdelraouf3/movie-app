import React from 'react'
import { AnimatePresence, motion, Variants } from "motion/react";
import movieImage from '/images/posters/image.webp'
import LabelBadge from './UI/LabelBadge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import Button from './UI/Button'
import { faListUl, faPlay } from '@fortawesome/free-solid-svg-icons'
import Loader from './UI/Loader'

interface CardGridProps {
    items: any[];
    loading?: boolean;
    mediaType?: 'movie' | 'tv';
    isFullData?: boolean;
    className?: string;
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w400";

const CardGrid = ( { items, loading = false, mediaType = 'movie', isFullData = true, className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-8 gap-y-2' }: CardGridProps ) => {

    if (loading) {
    
        return (
        
            <div className="relative min-h-100 w-full">
            
                <Loader isFullPage={false} />
            
            </div>
        
        );
    
    }

    if (!items || items.length === 0) {
    
        return <div className="text-center py-10 text-gray-text">No content found.</div>;
    
    }

    const displayItems = isFullData ? items : items?.slice(0, 12);

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
    
        <motion.div className={`${className}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}>
        
            { displayItems?.map( (item, index) => {
            
                const isMovie = 'title' in item || !('name' in item);
                const displayName = item?.title || item?.name;
                const rawDate = isMovie ? item?.release_date : item?.first_air_date;
                const year = item?.year || rawDate?.split('-')[0] || 'N/A';
                
                const posterUrl = item?.bannerPosterImage || `${TMDB_IMAGE_BASE}${item?.poster_path}` || movieImage;
                const qualityBadge = item?.quality || 'HD';
                const runningTime = item?.time || '120 min';
            
                return (
                
                    <motion.div key={index} className='col-span-1 w-full group' 
                        variants={itemVariants}>
                    
                        <div className="rounded-md overflow-hidden aspect-2/3 relative">
                        
                            <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                            
                                <img src={posterUrl} alt={displayName} title={displayName} className="w-full h-full object-cover" loading="lazy" />
                            
                            </div>
                        
                            <div className="absolute top-2 left-2">
                            
                                <LabelBadge label={qualityBadge} className={`${qualityBadge === 'HD' ? 'greenRoundedBadge' : 'yellowRoundedBadge-base'} rounded-md text-[10px]`} />
                            
                            </div>
                            
                            <div className='absolute top-2 right-2 z-20 rounded-full p-2 text-white bg-black/20 backdrop-blur-sm transition-colors duration-200 hover:bg-white/20  cursor-pointer'>
                            
                                <FontAwesomeIcon icon={faHeartRegular} className='text-[17px]' />
                            
                            </div>
                        
                            <div className="absolute inset-0 h-full w-full z-10 transition-all duration-500 group-hover:backdrop-blur-[3px]"></div>
                        
                            <div className="absolute top-1/2 left-1/2 -translate-1/2 z-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            
                                <Button buttonClassName='whiteRoundedBtn-base whiteRoundedBtn-hover' link={true} to={`/watch/${item.media_type || mediaType}/${item.id}/${displayName}`} label='watch' secondIcon={faPlay} secondIconClassName='text-[14px] text-black' />
                            
                                <Button buttonClassName='detailedRoundedBtn-base detailedRoundedBtn-hover mt-3' link={true} to={`/details/${item.media_type || mediaType}/${item.id}/${displayName}`} label='details' secondIcon={faListUl} secondIconClassName='text-[14px] text-white' />
                            
                            </div>
                        
                        </div>
                    
                        <div className="flex items-center gap-2 text-gray-400 text-[11px] mt-2">
                        
                            <span>{(item?.media_type || mediaType).toUpperCase()}</span>
                        
                            <span className="rounded-full w-1 h-1 bg-gray-600"></span>
                        
                            <span>{year}</span>
                        
                            <span className="rounded-full w-1 h-1 bg-gray-600"></span>
                        
                            <span>{runningTime}</span>
                        
                        </div>
                    
                        <h4 className="title-sub md:truncate text-sm group-hover:text-brand-blue">{displayName}</h4>
                    
                    </motion.div>

                )} ) }
        
        </motion.div>
    
    )

}

export default CardGrid