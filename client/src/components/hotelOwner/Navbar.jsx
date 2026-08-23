import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
 import { UserButton } from "@clerk/react"

const Navbar = () => {
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-3 bg-white sticky top-0 z-50 shadow-sm'>
      <Link to='/'>
        <img src={assets.logo} alt="logo" className='h-8 hover:opacity-80 transition-opacity invert opacity-80'/>
      </Link>
    <UserButton afterSignOutUrl='/'/> 
    </div>
  )
}

export default Navbar