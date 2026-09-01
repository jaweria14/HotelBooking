import React from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { useEffect } from 'react'

export default function Layout () {
  const{isOwner,navigate} =useAppContext();
  useEffect(()=>{
    if(!isOwner){
      navigate('/')
    }
  },[isOwner])
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar/>
      <div className='flex flex-1 min-h-0'>
      <Sidebar/>
       <div className='flex-1 min-w-0 p-4 pt-10 md:px-10 overflow-y-auto'>
      <Outlet/>
     </div>
     </div>
    

    </div>
  )
}