import React from 'react'

interface PaginationProps {
    current?: number;
    allPages?: number;
    onPageChange?: ( page: number ) => void;
    workingBtnClassName?: string;
    disabledBtnClassName?: string;
    nextPage?: number;
    previousPage?: number;
}

const Pagination = ( { current = 1, allPages = 3, nextPage, previousPage, onPageChange, workingBtnClassName = 'btn-base paginationBtn-base paginationBtn-hover', disabledBtnClassName = 'btn-base disabledBtn' }:PaginationProps ) => {

    const isFirstPage = current === 1
    const isLastPage = current === allPages 

    return (
    
        <>
        
            <div className="flex-center my-5">
            
                <button onClick={( ) => onPageChange?.( current - 1 )} className={ isFirstPage ? disabledBtnClassName : workingBtnClassName } disabled={isFirstPage}>previous</button>
            
                <p className='mx-4 text-white text-[16px]'> Page {current} of {allPages} </p>
            
                <button onClick={( ) => onPageChange?.( current + 1 )} className={isLastPage ? disabledBtnClassName : workingBtnClassName} disabled={isLastPage}>next</button>
            
            </div>
        
        </>
    
    )

}

export default Pagination