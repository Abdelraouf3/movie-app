import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { twMerge } from 'tailwind-merge'
import React, { ReactNode } from 'react'
import { Link } from 'react-router'

interface ButtonProps {
    link?: boolean;
    to?: string;
    href?: string;
    internal?: boolean;
    children?: ReactNode;
    title?: string;
    onClick?: React.MouseEventHandler;
    baseBtn?: string;
    buttonClassName?: string;
    label?: string;
    type?: "button" | "submit" | "reset";
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: "noopener noreferrer" | undefined;
    replace?: boolean;
    firstIcon?: IconDefinition;
    secondIcon?: IconDefinition;
    firstIconClassName?: string;
    secondIconClassName?: string;
    disabled?: boolean;
}

const Button = ( { link = false, to = '/', href = '/', internal = true, children, title = '', onClick = () => {}, 
    baseBtn = 'btn-base flex items-center justify-center px-4', buttonClassName = 'whiteBtn-base', label, type, 
    target, rel, replace = false, firstIcon, secondIcon, firstIconClassName = '', secondIconClassName = '', disabled = false }:ButtonProps ) => {

    const buttonClasses = twMerge(`${baseBtn} ${label && (firstIcon || secondIcon) ? `gap-3` : `` } `, buttonClassName)

    if (link) {
    
        if (internal) {
        
            return (
            
                <Link to={to} 
                    title={title} 
                    onClick={onClick} 
                    className={buttonClasses} 
                    replace={replace} 
                >
            
                    {firstIcon && <FontAwesomeIcon icon={firstIcon} className={`${firstIconClassName}`} /> }
            
                    { label && <span>{label}</span>}
            
                    {secondIcon && <FontAwesomeIcon icon={secondIcon} className={`${secondIconClassName}`} /> }
            
                    { children }
            
                </Link>
            
            )
        
        } else {
        
            return (
            
                <a href={href} 
                    title={title} 
                    onClick={onClick} 
                    className={buttonClasses} 
                    target={target}
                    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                >
            
                    {firstIcon && <FontAwesomeIcon icon={firstIcon} className={`${firstIconClassName}`} /> }
        
                    { label && <span>{label}</span>}
            
                    {secondIcon && <FontAwesomeIcon icon={secondIcon} className={`${secondIconClassName}`} /> }
            
                    { children }
            
                </a>
            
            )
        
        }
    
    }

    return (
    
        <button onClick={onClick} className={buttonClasses} title={title} type={type} disabled={disabled}>
    
            {firstIcon && <FontAwesomeIcon icon={firstIcon} className={`${firstIconClassName}`} /> }
    
            { label && <span>{label}</span>}
    
            {secondIcon && <FontAwesomeIcon icon={secondIcon} className={`${secondIconClassName}`} /> }
    
            { children }
    
        </button>
    
    )

}

export default Button