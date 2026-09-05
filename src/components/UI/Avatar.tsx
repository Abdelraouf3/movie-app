import React from 'react'

interface AvatarProps {
    currentAvatar?: string;
    size?: string;
}

const Avatar = ( {currentAvatar = 'batman', size = 'w-16 h-16'}: AvatarProps ) => {

    const getImageUrl = (name: string) => {
    
        return new URL(`../assets/images/avatars/${name}.png`, import.meta.url).href
    
    };

    return (
    
        <div className={`flex-center ${size} rounded-full cursor-pointer transition-all duration-200 border border-night-base/20 shadow-[0_0_1px_3px_rgba(212,175,55,0)] hover:border-gold-bright hover:shadow-[0_0_1px_3px_rgba(212,175,55,0.2)] overflow-hidden`}>
    
            <img src={getImageUrl(currentAvatar)} alt={currentAvatar} title={currentAvatar} className='w-full h-full object-cover' loading='lazy' />
    
        </div>
    
    )

}

export default Avatar;