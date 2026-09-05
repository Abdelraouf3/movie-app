import React, { useEffect, useRef, useState } from 'react'
import logo from '/public/favicon.ico'
import { AnimatePresence, motion, useAnimation, Variants } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight, faArrowsToDot, faBars, faChartColumn, faClose, faDisplay, faDownLeftAndUpRightToCenter, faFilm, faGear, faLayerGroup, faSearch, faTv } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faBell, faBellSlash, faCalendar, faComment, faFaceGrinHearts, faFaceSmile, faFaceSmileWink } from '@fortawesome/free-regular-svg-icons';
import { useDebounce } from '../Hooks/useDeBounce'
import Button from '../components/UI/Button';
import InputField from '../components/UI/InputField';
import Dropdown from '../components/UI/Dropdown'; 
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"notification" | "settings">('notification')

  const [navbarStyle, setNavbarStyle] = useState( () => {
  
    const savedNavbarStyle = localStorage.getItem("user_selected_navbar_style");
  
    return savedNavbarStyle || "Advanced"
  
  } )

  const handleNavbarStyleChange = (style: "Advanced" | "Basic") => {
  
    setNavbarStyle(style);
  
    localStorage.setItem("user_selected_navbar_style", style);
  
    setSettingOpen(false);
  
    setNotificationOpen(false);
  
  }

  const [selectedRegion, setSelectedRegion] = useState( () => {
  
    const savedRegion = localStorage.getItem("user_selected_region");
  
    return savedRegion || "English";
  
  } )

  const handleSelectedRegionChange = (region: string) => {
  
    setSelectedRegion(region);
  
    localStorage.setItem("user_selected_region", region)
  
  }

  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 300)

  const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            // Redirects to your dedicated search page with the query param
            navigate(`/search?query=${encodeURIComponent(search.trim())}`);
            setSearch(''); // Clear input
        }
  };

  const [notificationOpen, setNotificationOpen] = useState(false)
  const [settingOpen, setSettingOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const notificationBoxRef = useRef<HTMLDivElement>(null)
  const settingsBoxRef = useRef<HTMLDivElement>(null)
  const menuBoxRef = useRef<HTMLDivElement>(null)

  useEffect( () => {
  
    const handleClickOutside = (event: MouseEvent) => {
    
      const target = event.target as Node;
    
      if (notificationBoxRef.current && !notificationBoxRef.current.contains(target)) {
        setNotificationOpen(false)
      } 
    
      if (settingsBoxRef.current && !settingsBoxRef.current.contains(target)) {
        setSettingOpen(false)
      } 
    
      if (menuBoxRef.current && !menuBoxRef.current.contains(target)) {
          setMenuOpen(false)
        } 
    
    }
  
    if (notificationOpen || settingOpen || menuOpen) {
    
      window.document.body.style.overflow = 'hidden';
      window.document.body.style.touchAction = 'none';
      window.addEventListener("mousedown", handleClickOutside)
    
    } else {
    
      window.removeEventListener("mousedown", handleClickOutside)
      window.document.body.style.overflow = 'auto';
      window.document.body.style.touchAction = 'auto';
    
    }
  
    return () => {
    
      window.removeEventListener("mousedown", handleClickOutside)
      window.document.body.style.overflow = 'auto';
      window.document.body.style.touchAction = 'auto';
    
    }
  
  }, [notificationOpen, settingOpen, menuOpen] )

  const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, 
    },
  },
};

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 12,
      },
    },
  };

  useEffect(() => {
    const cleanSearch = debouncedSearch.trim();
    
    if (cleanSearch.length > 0) {
      navigate(`/search?query=${encodeURIComponent(cleanSearch)}`);
    }
  }, [debouncedSearch, navigate]);

  return (
  
    <AnimatePresence mode='wait'>
    
      <header className={`${navbarStyle === "Advanced" ? `fixed top-0 z-50 w-screen border-0 transition-colors duration-300 ease-out bg-linear-to-b from-black/80 to-transparent` : `fixed top-0 left-0 right-0 z-40 w-full border-b border-zinc-deep bg-night-base`}`} >
      
        <div className={`${navbarStyle === "Advanced" ? `w-full flex h-20 items-center justify-between pl-4 sm:pl-[2.3rem] pr-4` : `container flex h-16 items-center justify-between w-full px-2 sm:px-12 mx-auto relative`} `}>
          
          <motion.div className={`${navbarStyle === "Advanced" ? `flex items-center space-x-8 relative` : `flex items-center`}`}
            key={`left-${navbarStyle}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
          
            <motion.div variants={itemVariants}>
            
              <Button link baseBtn={''} buttonClassName={'flex-center gap-3'} label={''} >
              
                <img src={logo} alt="logo" className='w-8 md:w-10 lg:w-12.5' loading='lazy' />
              
                <span className='hidden md:text-[30px] font-Roboto-SemiCondensed-Black text-brand-yellow first-letter:text-white tracking-[3px] lg:hidden'>FB<span className='text-white'><FontAwesomeIcon icon={faFaceSmileWink} /></span> x</span>
              
              </Button>
            
            </motion.div>
          
            <ul className={`hidden lg:flex items-center justify-between gap-2`}> 
            
              { [{ path: 'movie', label: 'movies', icon: faFilm },
                { path: 'tv',  label: 'shows', icon: faTv }].map( (category, index) => (
              
                <motion.li key={index} variants={itemVariants} className='group relative'>
                
                  <Button link internal to={`/${category.path}/discover`} buttonClassName='transparentBtn-base border-none paginationBtn-hover hover:bg-[rgb(31, 41, 55)] text-[14px] font-Inter_18pt-Medium capitalize' label={category.label} firstIcon={category.icon} />
                
                </motion.li>
              
              ) ) }
            
            </ul>
          
          </motion.div>
        
          <motion.div className={`${navbarStyle === "Advanced" ? `flex flex-1 items-center justify-end gap-2 ml-2 sm:ml-0` : `flex items-center gap-1 sm:gap-2 ml-8 lg:ml-12`}`}
            key={`right-${navbarStyle}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
          
            <div className='hidden lg:block w-full max-w-sm mr-2'>
            
              <form className='search-box' onSubmit={handleSearchSubmit}>
              
                <motion.div className='relative flex items-center search-container'
                  variants={itemVariants}
                >
                
                  <InputField
                    type="text"
                    placeholder="Search..."
                    inputClassName='flex w-full rounded-md border border-zinc-deep bg-night-base py-2 ring-night-base px-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-text focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                    autoFocus
                    autoComplete="off"
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    inputIcon={faSearch}
                    iconClassName='text-gray-text'
                  />
                
                </motion.div>
              
              </form>
            
            </div>
          
            <motion.div variants={itemVariants}>
            
              <Button 
                link={true} 
                internal={true} 
                buttonClassName='transparentBtn-base transparentBtn-hover' 
                label='' 
                firstIcon={faDiscord} 
                firstIconClassName='text-[14px]' 
              />
            
            </motion.div>
          
            <motion.div variants={itemVariants}>
            
              <Button 
                link={true} 
                internal={true} 
                buttonClassName='transparentBtn-base transparentBtn-hover bg-night-base' 
                label='' 
                firstIcon={faBell} 
                firstIconClassName='text-[14px]' 
                onClick={ () => setNotificationOpen(!notificationOpen) } 
              />
            
            </motion.div>
          
            <motion.div className='relative'
              variants={itemVariants}
            >
            
              <Button 
                link={true} 
                internal={true} 
                buttonClassName='transparentBtn-base text-white-pure/50 bg-night-base border border-night-base shadow-[0_0_1px_3px_rgba(212,175,55,0)] hover:border-dark-yellow hover:text-dark-yellow hover:shadow-[0_0_1px_3px_rgba(212,175,55,0.2)] rounded-[9999px] w-10 h-10' 
                label='' 
                firstIcon={faGear} 
                firstIconClassName='text-[14px]'
                onClick={ () => setSettingOpen(!settingOpen) }
              />
            
              { settingOpen && (
              
                <motion.div 
                  className="absolute right-0 top-12 w-72 bg-night-base border border-zinc-deep rounded-md shadow-md text-gray-text p-4 space-y-4"
                  ref={settingsBoxRef}
                  
                >
                
                  <h4 className='text-white-pure text-[19px] font-Inter_28pt-Black'>Settings</h4>
                
                  <div className='space-y-2'>
                  
                    <label className="block text-[12px]">Account</label>
                  
                    <Button 
                      link
                      internal
                      to='/'
                      buttonClassName='transparentBtn-base transparentBtn-hover'
                      label='Login'
                    />
                  
                  </div>
                
                  <div className='space-y-2'>
                  
                    <label className="block text-[12px]">Region</label>
                  
                    <Dropdown 
                      className='w-full'
                      options={['English', 'Egypt']}
                      selectedOption={selectedRegion}
                      onSelect={handleSelectedRegionChange}
                      isFlag
                    />
                  
                  </div>
                
                  <div className="flex-between">
                  
                    <h5 className='flex items-center gap-2 text-[13px]'> 
                    
                      <FontAwesomeIcon icon={faArrowsToDot} />
                    
                      AI Recommendations
                    
                    </h5>
                  
                    <label className="switch">
                    
                      <input type="checkbox" disabled defaultChecked={true} />
                      <span className="slider"></span>
                    
                    </label>
                  
                  </div>
                
                  <div className='space-y-3'>
                  
                    <label className="block text-[12px]">Navbar Style</label>
                  
                    <Button 
                      buttonClassName={`transparentBtn-base transparentBtn-hover w-full`}
                      label='Basic'
                      firstIcon={faDownLeftAndUpRightToCenter}
                      firstIconClassName='text-[12px]'
                      onClick={ () => { handleNavbarStyleChange("Basic") } }
                    />
                  
                    <Button 
                      buttonClassName={`whiteBtn-base hover:bg-dark-yellow w-full`}
                      label='Advanced'
                      firstIcon={faLayerGroup}
                      onClick={ () => { handleNavbarStyleChange("Advanced") } }
                    />
                  
                  </div>
                
                </motion.div>
              
              ) }
            
            </motion.div>
          
            <motion.div className='flex lg:hidden'
              variants={itemVariants}
            >
            
              <Button 
                buttonClassName='transparentBtn-base transparentBtn-hover bg-night-base' 
                label='' 
                firstIcon={faBars} 
                firstIconClassName='text-[14px]' 
                onClick={ () => setMenuOpen(!menuOpen) } 
              />
            
            </motion.div>
          
          </motion.div>
        
        </div>
      
      </header>
    
      { notificationOpen && (
      
        <div className="fixed flex-center bg-black/80 w-lvw h-lvh z-99999">
        
          <div className="relative bg-night-base border border-ui-muted shadow-lg p-2 md:p-6 rounded-lg sm:max-h-2xl sm:max-w-2xl h-fit w-[95vw] max-h-[90vh] max-w-[95vw] sm:h-auto sm:w-auto z-999999999"
            ref={notificationBoxRef} 
          >
          
            <FontAwesomeIcon icon={faClose} className='absolute right-5 top-5 text-white cursor-pointer' onClick={ () => setNotificationOpen(false) } />
          
            <div className="flex flex-col space-y-1.5">
            
              <h4 className="flex items-center gap-2 text-lg font-Inter_28pt-Black">
              
                <FontAwesomeIcon icon={faBell} className='mr-3 text-[18px]' />
              
                Notifications
              
              </h4>
            
              <p className="text-gray-text text-[14px]">
              
                Stay updated with new movies, TV shows, and platform updates.
              
              </p>
            
            </div>
          
            <div className="items-center justify-center rounded-md bg-zinc-deep p-1 text-gray-text overflow-x-auto flex-nowrap scrollbar-hide sm:overflow-x-visible sm:flex-wrap grid w-full grid-cols-2">
            
              <Button 
                buttonClassName={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-0 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-xs sm:text-sm ${activeTab === 'notification' ? `paginationBtn-base paginationBtn-hover`: `` } `} 
                onClick={ () => { setActiveTab('notification'); } } 
                label='Notifications' 
              />
            
              <Button 
                buttonClassName={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-0 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-xs sm:text-sm ${activeTab === 'settings' ? `paginationBtn-base paginationBtn-hover`: `` }`} 
                onClick={ () => { setActiveTab('settings'); } } 
                label='Settings' 
              /> 
            
            </div>
          
            { activeTab === 'notification' && (
            
              <div>
              
                <div className="flex items-center justify-between mt-3">
                
                  <Button
                    buttonClassName='whiteBtn-base whiteBtn-hover gap-2'
                    label='Community (0)'
                    firstIcon={faComment}
                    />
                
                  <Button 
                    buttonClassName='transparentBtn-base transparentBtn-hover gap-2'
                    label='Latest'
                    firstIcon={faCalendar}
                  />
                
                </div>
              
                <div className="text-center py-8 text-gray-text">
                
                  <span className='block'><FontAwesomeIcon icon={faBellSlash} className='text-[70px] text-gray-text/20 mb-4' /></span>
                
                  <p className='leading-7 text-[14px]'>
                  
                    No community notifications found <br />
                    Try switching to a different filter or check back later
                  
                  </p>
                
                </div>
              
              </div>
            
            ) }
          
            { activeTab === 'settings' && (
            
              <div>
              
                <div className="my-5">
                
                  <h3 className='mb-3'>Content Notifications</h3>
                
                  <ul className='space-y-4'>
                  
                    <li className='flex-between'>
                    
                      <h4>  
                      
                        <FontAwesomeIcon icon={faFilm} className='text-brand-blue mr-2' /> 
                      
                        New Movies
                      
                      </h4>
                    
                      <div>
                      
                        <label className="switch">
                        
                          <input type="checkbox" />
                          <span className="slider"></span>
                        
                        </label>
                      
                      </div>
                    
                    </li>
                  
                    <li className='flex-between'>
                    
                      <h4>  
                      
                        <FontAwesomeIcon icon={faTv} className='text-brand-green mr-2' /> 
                      
                        New TV shows
                      
                      </h4>
                    
                      <div>
                      
                        <label className="switch">
                        
                          <input type="checkbox" />
                          <span className="slider"></span>
                        
                        </label>
                      
                      </div>
                    
                    </li>
                  
                    <li className='flex-between'>
                    
                      <h4>  
                      
                        <FontAwesomeIcon icon={faCalendar} className='text-purple mr-2' /> 
                      
                        New Seasons
                      
                      </h4>
                    
                      <div>
                      
                        <label className="switch">
                        
                          <input type="checkbox" />
                          <span className="slider"></span>
                        
                        </label>
                      
                      </div>
                    
                    </li>
                  
                    <li className='flex-between'>
                    
                      <h4>  
                      
                        <FontAwesomeIcon icon={faCalendar} className='text-purple mr-2' /> 
                      
                        New Episodes
                      
                      </h4>
                    
                      <div>
                      
                        <label className="switch">
                        
                          <input type="checkbox" />
                          <span className="slider"></span>
                        
                        </label>
                      
                      </div>
                    
                    </li>
                  
                  </ul>
                
                </div>
              
                <div className="my-5">
                
                  <h3 className='mb-3'>System Notifications</h3>
                
                  <ul className='space-y-4'>
                  
                    <li className='flex-between'>
                    
                      <h4>  
                      
                        <FontAwesomeIcon icon={faGear} className='text-brand-blue mr-2' /> 
                      
                        Platform Updates
                      
                      </h4>
                    
                      <div>
                      
                        <label className="switch">
                        
                          <input type="checkbox" />
                          <span className="slider"></span>
                        
                        </label>
                      
                      </div>
                    
                    </li>
                  
                  </ul>
                
                </div>
              
                <div className="my-5">
                
                  <h3 className='mb-3'>Delivery Methods</h3>
                
                  <ul className='space-y-4'>
                  
                    <li className='flex-between'>
                    
                      <h4>  
                      
                        Browser Notifications
                      
                      </h4>
                    
                      <div>
                      
                        <label className="switch">
                        
                          <input type="checkbox" />
                          <span className="slider"></span>
                        
                        </label>
                      
                      </div>
                    
                    </li>
                  
                    <li className='flex-between'>
                    
                      <h4>  
                      
                        Email Notifications
                      
                      </h4>
                    
                      <div>
                      
                        <label className="switch">
                        
                          <input type="checkbox" disabled defaultChecked={true} />
                          <span className="slider"></span>
                        
                        </label>
                      
                      </div>
                    
                    </li>
                  
                  </ul>
                
                </div>
              
              </div>
            
            ) }
          
            <div className='flex items-center justify-end'>
            
              <Button 
                buttonClassName='transparentBtn-base transparentBtn-hover'
                label='Close'
                onClick={ () => setNotificationOpen(false) }
              />
            
            </div>
          
          </div>
        
        </div>
      
      ) }
    
      { menuOpen && (
      
        <div className='fixed bottom-0 left-0 right-0 border-t border-white-border bg-night-base p-5 z-999' 
          ref={menuBoxRef}
        >
        
          <div className="flex-center">
          
            <span className='block text-center bg-white-border h-2 w-2/12 rounded-2xl'
              onClick={ () => setMenuOpen(!menuOpen) }></span>
          
          </div>
        
          <h4 className='mt-3 text-[22px] font-Inter_24pt-Black'>Menu</h4>
        
          <ul> 
          
            { [{ path: 'movie', label: 'movies', icon: faFilm },
              { path: 'tv',  label: 'shows', icon: faTv }].map( (category, index) => (
            
              <motion.li key={index} variants={itemVariants} className='group relative flex-between'>
              
                <Button link internal to={`/${category.path}/discover`} onClick={ () => setMenuOpen(!menuOpen) } buttonClassName='transparentBtn-base border-none paginationBtn-hover hover:bg-[rgb(31, 41, 55)] text-[14px] font-Inter_18pt-Medium capitalize justify-start' label={category.label} firstIcon={category.icon} />
              
                <FontAwesomeIcon icon={faAngleRight} />
              
              </motion.li>
            
            ) ) }
          
          </ul>
        
        </div>
      
      ) }
    
    </AnimatePresence>
  
  )

}

export default Header