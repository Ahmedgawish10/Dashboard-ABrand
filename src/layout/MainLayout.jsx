import React, { useState } from 'react'
import Navbar from '../components/common/navbar/Navbar'
import Sidebar from '../components/common/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import { useMediaQuery, Box } from '@mui/material';
import Test from "../pages/home/chart/Chart2";

export default function MainLayout() {
    const isSmallScreen = useMediaQuery('(max-width: 600px)');
    const [toggleMenu,setToggleMenu]=useState(true);

    const handleMenu=()=>{
        setToggleMenu((prev)=>!prev)
      }

  return (
    <div className='MainLayout'>
       <Navbar toggleMenu={toggleMenu} handleMenu={handleMenu}/>
       <Sidebar  toggleMenu={toggleMenu}/>
       <div className={`main-outlet mt-[50px] ${toggleMenu && !isSmallScreen ?"ml-[140px] transition-all duration-[800ms] ":" "}`}>
        <Outlet/>
       </div>
         
    </div>
  )
}
