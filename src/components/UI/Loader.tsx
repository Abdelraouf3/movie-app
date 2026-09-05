import React from 'react'

interface LoaderProps {
    isFullPage?: boolean;
}

const Loader = ( { isFullPage = true }:LoaderProps ) => {

    if (!isFullPage) {
    
        return (
        
            <div className='fixed top-0 left-0 w-full h-1 z-999 bg-transparent'>
            
                <div className='h-full bg-(image:--color-gradient-rainbow) animate-load'></div>
            
            </div>
        
        );
    
    }

    return (
    
        <div className='flex-center fixed inset-0 w-full h-full bg-night-base text-gray-cool z-999 cursor-default'>Loading...</div>
    
    );

};

export default Loader