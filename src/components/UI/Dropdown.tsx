import { faAngleDown, faAngleUp, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import en from './assets/flags/gb.svg'
import ar from './assets/flags/egypt.png'

type DropdownVariant = 'default' | 'filter'

const FLAG_MAP: Record<string, string> = {
    'English': en,
    'Egypt': ar,
}

interface DropdownProps {
    variant?: DropdownVariant;
    className?: string;
    options?: (string | number)[];
    onSelect?: (option: string | number) => void;
    selectedOption?: string | number;
    isFlag?: boolean;
    flag?: string;
}

const Dropdown = <T extends string | number> ( {
    variant = 'default',
    className = '',
    options = ['season 1', 'season 2', 'season 3', 'season 4', 'season 5', 'season 6', 'season 7', 'season 8', 'season 9', 'season 10', 'season 11', 'season 12', 'season 13', 'season 14', 'season 15', 'season 16', 'season 17', 'season 18', 'season 19', 'season 20', 'season 21','season 22', 'season 23',],
    onSelect,
    selectedOption = 'season 1',
    isFlag = false,
    flag = en
}: DropdownProps  ) => {         

    const isFilter = variant === 'filter';

    const [open, setOpen] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [openUp, setOpenUp] = useState(false);

    const savedRegion = localStorage.getItem("user_selected_region");

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                !buttonRef.current?.contains(target)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            window.addEventListener('mousedown', handleClickOutside);

            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                setOpenUp(spaceBelow < 300);
            }

            setTimeout(checkScrollPosition, 10);
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.touchAction = 'auto';
            stopScrolling();
        }

        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.touchAction = 'auto';
            window.removeEventListener('mousedown', handleClickOutside);
        };

    }, [open]);

    const handleOptionClick = (option: string | number) => {
        onSelect?.(option);
        setOpen(false);
        stopScrolling();
    };

    const checkScrollPosition = () => {
        if (!scrollContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

        setIsAtTop(scrollTop <= 5);
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5);

        if (scrollTop <= 0 || scrollTop + clientHeight >= scrollHeight) {
            stopScrolling();
        }
    };

    const startScrolling = (dir: 'up' | 'down') => {
        stopScrolling();

        scrollIntervalRef.current = setInterval(() => {
            if (!scrollContainerRef.current) return;

            scrollContainerRef.current.scrollTop += dir === 'up' ? -30 : 30;
            checkScrollPosition();
        }, 15);
    };

    const stopScrolling = () => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    return (
    
        <div ref={dropdownRef} 
            className={`relative group w-full ${className}`}>
        
            <button
                ref={buttonRef}
                onClick={() => setOpen(p => !p)}
                className={`
                    w-full flex justify-between items-center transition-colors duration-200
                    border border-gray-text/50 py-2 px-4 rounded-lg cursor-pointer outline-none
                    ring-2 ring-transparent
                    ${isFilter
                        ? 'bg-night-base text-gray-400 focus:ring-white group-hover:text-black group-hover:bg-brand-yellow'
                        : 'bg-night-base text-white focus:ring-brand-yellow'
                    }
                    ${className}
                `}
            >
            
                <span className={`flex items-center gap-3 capitalize font-Inter_18pt-Medium truncate ${isFilter ? 'text-[14px]' : 'text-[14px]'}`}>
                
                    { isFlag && (<img src={FLAG_MAP[String(selectedOption)] || flag} className="w-4 h-4" loading='lazy' /> )} 
                
                    <span className="truncate">{selectedOption}</span>
                
                </span>
            
                <FontAwesomeIcon
                    icon={faAngleDown}
                    className={`
                        text-gray-cool transition-all duration-200
                        ${open ? 'rotate-180' : ''}
                        ${isFilter ? 'group-hover:text-black' : ''}
                    `}
                />
            
            </button>
        
            {open && (
            
                <div
                    className={`
                        absolute left-0 z-999 mt-2 transition-all duration-200
                        bg-night-base border border-white-border rounded-[10px]
                        shadow-2xl flex flex-col overflow-hidden max-h-80 min-w-full w-max
                        ${isFilter ? 'w-full' : 'w-64'}
                        ${openUp ? 'bottom-full mb-2' : 'mt-2'}
                        ${className}
                    `}
                >
                
                    {!isFilter && (
                    
                        <div
                            onMouseEnter={() => startScrolling('up')}
                            onMouseLeave={stopScrolling}
                            className={`
                                absolute top-0 left-0 w-full flex-center
                                bg-night-base cursor-pointer border-2 border-white/5
                                transition-opacity duration-200
                                ${isAtTop ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                            `}
                        >
                        
                            <FontAwesomeIcon icon={faAngleUp} className='animate-bounce text-xs' />
                        
                        </div>
                    
                    )}
                
                    <div
                        ref={scrollContainerRef}
                        onScroll={checkScrollPosition}
                        className="max-h-80 overflow-y-auto no-scrollbar overscroll-contain"
                        style={!isFilter ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
                    >
                    
                        <div className={`flex flex-col ${!isFilter ? 'p-1' : ''}`}>
                        
                            {options.map((option, index) => { 
                            
                                const optionString = String(option);
                                const hasFlag = isFlag && FLAG_MAP[optionString];
                                const isCurrentSelection = option === selectedOption
                            
                                return (
                            
                                    <div
                                        key={index}
                                        onClick={() => handleOptionClick(option)}
                                        className={`
                                            flex items-center gap-2 px-3 py-2 cursor-pointer
                                            transition-all duration-100 rounded-[10px]
                                            ${isFilter
                                                ? 'hover:bg-blue hover:text-gray-dark'
                                                : 'hover:bg-gold-bright hover:text-black-pure'
                                            }
                                        `}
                                    >
                                    
                                        <div className="w-4 flex-center gap-3">
                                        
                                            {hasFlag ? ( 
                                            
                                                <img src={FLAG_MAP[optionString]} alt={optionString} className="w-4 h-4" loading='lazy' />
                                            
                                            ) :
                                            
                                            isCurrentSelection && (
                                            
                                                <FontAwesomeIcon icon={faCheck} className="text-[16px]" />
                                            
                                            )}
                                        
                                        </div>
                                    
                                        <span className="capitalize whitespace-nowrap text-[14px]">
                                            {option}
                                        </span>
                                    
                                    </div>
                            
                            )})}
                        
                        </div>
                    
                    </div>
                
                    {!isFilter && (
                    
                        <div
                            onMouseEnter={() => startScrolling('down')}
                            onMouseLeave={stopScrolling}
                            className={`
                                absolute bottom-0 left-0 w-full py-1
                                bg-night-base text-white flex justify-center items-center
                                border-t border-white/5 transition-opacity duration-200
                                ${isAtBottom ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                            `}
                        >
                        
                            <FontAwesomeIcon icon={faAngleDown} className="animate-bounce text-xs" />
                        
                        </div>
                    
                    )}
                
                </div>
            
            )}
        
        </div>
    
    );

};

export default Dropdown;