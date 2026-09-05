import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import Footer from './Footer'

const Layout = () => {

    return (
    
        <>
        
            <Header />
        
            <Outlet></Outlet>
        
            <Footer />
        
        </>
    
    )

}

export default Layout
