import React from 'react'
import { Route, Routes } from 'react-router'
import Layout from '../layouts/Layout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import MediaExplorer from '@/pages/MediaExplorer'
import SearchResults from '@/pages/SearchResults'
import Watch from '@/pages/Watch'
import MediaDetails from '@/pages/MediaDetails'

const AppRoutes = () => {

    return (
    
        <Routes>
        
            <Route element={ <Layout /> }>
            
                <Route path='/' element={<Home />} />
            
                <Route path='/:mediaType/:category' element={<MediaExplorer />} />
            
                <Route path='/login' element={<Login />} />
            
                <Route path='/watch/:mediaType/:mediaId/:mediaName' element={<Watch />} />
            
                <Route path='/details/:mediaType/:mediaId/:mediaName' element={<MediaDetails />} />
            
                <Route path='/search' element={<SearchResults />} />
            
            </Route>
        
        </Routes>
    
    )

}

export default AppRoutes
