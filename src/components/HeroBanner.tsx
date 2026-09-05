import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from "motion/react";
import heroBannerData from '../Services/API/HeroBannerData.json';
import LabelBadge from './UI/LabelBadge';
import Button from './UI/Button';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faAngleRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

const HeroBanner = () => {    

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect( () => {
    
        const interval = setInterval(() => {
        
            setCurrentIndex( prev => prev === heroBannerData.length - 1 ? 0 : prev + 1 )
        
        }, 5000);
    
        return () => clearInterval(interval);
    
    }, [])

    const currentBanner = heroBannerData[currentIndex];

    return (
        <div className="h-screen w-full overflow-hidden relative group min-h-screen">
        
            <AnimatePresence mode='wait'>
            
                <motion.div key={currentBanner.id} 
                    className="absolute inset-0 opacity-[1]"
                    initial={{ opacity: 0, scale: 1.2 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                >
                
                    <img src={currentBanner.bannerBackgroundImage} alt={currentBanner.title} title={currentBanner.title} className="w-full h-full object-cover" />
                
                </motion.div>
            
            </AnimatePresence>
        
            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent"></div>
        
            <div className="inset-0 items-end text-left bg-[linear-gradient(0deg,rgba(21,26,36,0.9),transparent_70%)] opacity-[1] flex relative z-20 h-full">
            
                <div className="w-full flex items-center px-4 md:px-16 pt-20">
                
                    <div className="flex-1 space-y-7 max-w-3xl p-4">
                    
                        <div className="flex flex-wrap gap-3">
                        
                            { currentBanner.genre.map( (genre) => (
                            
                                <span key={genre} className="text-[18px] font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">{genre}</span>
                            
                            ) ) }
                        
                        </div>
                    
                        <AnimatePresence mode='wait'>
                        
                            <motion.div key={currentBanner.id} 
                                className='opacity-[1] transform-none'
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            >
                            
                                <img src={currentBanner.bannerTitleImage} alt={currentBanner.bannerTitleImage} className='text-transparent max-h-40 w-auto transition-transform duration-200 hover:scale-105' width={500} height={150} loading='lazy' />
                            
                            </motion.div>
                        
                        </AnimatePresence>
                    
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white font-medium opacity-[1]">
                        
                            <LabelBadge label={`IMDB ${currentBanner.IMDBRate}`} className='yellowBadge' />
                        
                            <LabelBadge label={currentBanner.quality} className={`rounded-none ${currentBanner.quality === 'HD' || 'DCPRip' ? `greenRoundedBadge` : `yellowRoundedBadge-base`}`} />
                        
                            <LabelBadge className='spaceBlueBadge ' label={currentBanner.category} />
                        
                            <span className="text-gray-300">{currentBanner.time}</span>
                        
                            <span className="text-gray-300">{currentBanner.year}</span>
                        
                        </div>
                    
                        <AnimatePresence mode='wait'>
                        
                            <motion.p key={currentBanner.id} className="line-clamp-3 text-[20px] font-Inter_18pt-Medium md:text-[24px] text-gray-300 leading-relaxed max-w-2xl"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 1, ease: 'easeOut', delay: .5 }}
                            >
                                {currentBanner.description}
                            </motion.p>
                        
                        </AnimatePresence>
                    
                        <div className="flex items-center gap-4 py-4">
                        
                            <Button link={true} href='/' internal={false} buttonClassName='roundedYellowBtn-base hover:opacity-85 px-5 py-3 lg:px-8 lg:py-5 xl:px-10 xl:py-6 text-[18px] md:text-[22px] lg:text-[25px] capitalize' label='watch now' secondIcon={faCirclePlay}  />
                        
                            <Button baseBtn='' buttonClassName='flex-center size-10 md:w-14 md:h-14 rounded-full border-2 transition-all bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white' label='' secondIcon={regularHeart} />
                        
                        </div>
                    
                    </div>
                
                    <div className="hidden lg:flex flex-col items-end gap-6 ml-auto z-30">
                    
                        <AnimatePresence mode='wait'>
                        
                            <motion.div key={currentBanner.id} 
                                className="relative group"
                                initial={{ opacity: 0, x: 75 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -75 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            >
                            
                                <img src={currentBanner.bannerPosterImage} alt={currentBanner.bannerPosterImage} className='w-70 h-100 object-cover rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105' loading='lazy' />
                            
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 to-transparent rounded-b-xl" > 
                                
                                    <p className="text-white font-bold text-center text-sm line-clamp-1">{currentBanner.title}</p>
                                
                                </div>
                            
                            </motion.div>
                        
                        </AnimatePresence>
                    
                        <div className="flex items-center gap-6 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10" > 
                        
                            <span className="text-white font-medium text-lg tracking-widest"> 
                            
                                {currentBanner.id}
                            
                                <span className="text-gray-400 text-sm mx-1">/</span>
                            
                                10
                            
                            </span>
                        
                            <div className="flex items-center gap-2">
                            
                                <Button baseBtn='' buttonClassName='w-12 h-12 flex-center bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 active:scale-95' label='' firstIcon={faAngleLeft} firstIconClassName='text-white text-[18px]' onClick={ () => { currentIndex === 0 ? setCurrentIndex(heroBannerData.length - 1) : setCurrentIndex(currentIndex - 1); } } />
                            
                                <Button baseBtn='' buttonClassName='w-12 h-12 flex-center bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 active:scale-95' label='' firstIcon={faAngleRight} firstIconClassName='text-white text-[18px]' onClick={ () => { currentIndex === heroBannerData.length - 1 ? setCurrentIndex(0) : setCurrentIndex(currentIndex + 1); } } />
                            
                            </div>
                        
                        </div>
                    
                    </div>
                
                </div>
            
            </div>
        
        </div>
    );
};

export default HeroBanner;