import React from 'react'

interface LabelBadgeProps {
    label?: string;
    className?: string;
    rate?: number;
}

const LabelBadge = ( { label = '', className = 'greenRoundedBadge', rate}:LabelBadgeProps ) => {

    return (
    
        <>
        
            <span className={`${className}`}>
            
                {label}{rate}
            
            </span>
        
        </>
    
    )

}

export default LabelBadge
