import React from 'react'
import logo from '../../public/favicon.ico'
import Button from '../components/UI/Button'

const Footer = () => {

    return (
    
        <>
        
            <footer className='w-full bg-night-base text-white mt-16 border-t border-white/10 '
                style={{margin: "0px 0px 0px calc(50% - 50vw)", width: "99.7vw"}} >
            
                <div className="px-6 py-12">
                
                    <div className="max-w-6xl mx-auto">
                    
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-12">
                        
                            <div className="lg:col-span-2">
                            
                                <div className="logo mb-3">
                                
                                    <Button link baseBtn='' buttonClassName='' label='' >
                                    
                                        <img src={logo} alt={logo} className='w-auto h-16' loading='lazy' />
                                    
                                    </Button>
                                
                                </div>
                            
                                <p className='text-gray-text text-sm leading-relaxed'>
                                
                                    Your ultimate destination for free movies and TV shows. <br />
                                
                                    Watch thousands of titles in HD quality without registration.
                                
                                </p>
                            
                            </div>
                        
                            <div>
                            
                                <h4 className='mb-4'>Movies</h4>
                            
                                <ul>
                                
                                    { ['Popular Movies', 'Latest Movies', 'Now Playing', 'Upcoming', 'Anime Movie',].map( (category: string, index) => (
                                    
                                        <li key={index}>
                                        
                                            <Button link internal to='/movie/discover' buttonClassName='text-gray-text bg-transparent hover:text-white p-0 justify-start text-sm font-Inter_18pt-Medium' label={category} />
                                        
                                        </li>
                                    
                                    ) ) }
                                
                                </ul>
                            
                            </div>
                        
                            <div>
                            
                                <h4 className='mb-4'>TV Shows</h4>
                            
                                <ul>
                                
                                    { ['Popular TV Shows', 'Latest TV Shows', 'Airing Today', 'On The Air', 'TV Anime',].map( (category: string, index) => (
                                    
                                        <li key={index}>
                                        
                                            <Button link internal to='/tv/discover' buttonClassName='text-gray-text bg-transparent hover:text-white p-0 justify-start text-sm font-Inter_18pt-Medium' label={category} />
                                        
                                        </li>
                                    
                                    ) ) }
                                
                                </ul>
                            
                            </div>
                        
                            <div>
                            
                                <h4 className='mb-4'>Quick Links</h4>
                            
                                <ul>
                                
                                    { [ { categoryName: 'Sign in', categoryLink: '/' }, 
                                        { categoryName: 'Discord', categoryLink: '/' }, 
                                        { categoryName: 'Popular Persons', categoryLink: '/' }, 
                                        { categoryName: 'Live TV', categoryLink: '/' }, 
                                        { categoryName: 'Trending', categoryLink: '/' } ].map( (category: { categoryName: string, categoryLink: string }, index) => (
                                    
                                        <li key={index}>
                                        
                                            <Button link internal to={category.categoryLink} buttonClassName='text-gray-text bg-transparent hover:text-white p-0 justify-start text-sm font-Inter_18pt-Medium' label={category.categoryName} />
                                        
                                        </li>
                                    
                                    ) ) }
                                
                                </ul>
                            
                            </div>
                        
                        </div>
                    
                        <div className="border-t border-white/10 pt-8 mb-8">
                        
                            <div className="flex-center flex-wrap gap-6 ">
                            
                                { ['Privacy Policy', 'Terms of Services', 'DMCA', 'Content Removal', 'About Cast', 'Sitemap'].map( (category: string, index) => (
                                
                                    <div key={index}>
                                    
                                        <Button link internal to='/' buttonClassName='text-gray-text bg-transparent hover:text-white p-0 justify-start text-md font-Inter_18pt-Medium' label={category} />
                                    
                                    </div>
                                
                                ) ) }
                            
                                
                            
                            </div>
                        
                        </div>
                    
                    </div>
                
                    <div className="border-t border-white/10 pt-6">
                    
                        <div className="max-w-6xl mx-auto">
                        
                            <div className="flex-between flex-col md:flex-row text-sm text-gray-500 gap-4">
                            
                                <div className="flex items center gap-2">
                                
                                    <span> &copy; {new Date().getFullYear()} Cast </span>
                                
                                    <span>All rights reserved</span>
                                
                                </div>
                            
                                <div className="flex items-center gap-2">
                                
                                    <span>Made with</span>
                                
                                    <span>❤️</span>
                                
                                    <span> by Abdelraouf Halaby</span>
                                
                                </div>
                            
                                <div className="text-center md:text-end text-xs max-w-sm">
                                
                                    <span>This site does not store any files on its server. All contents are provided by non-affiliated third parties.</span>
                                
                                </div>
                            
                            </div>
                        
                        </div>
                    
                    </div>
                
                </div>
            
            </footer>
        
        </>
    
    )

}

export default Footer