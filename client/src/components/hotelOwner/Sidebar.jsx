import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

  const sidebarLinks = [
    {name: "Dashboard", path: "/owner", icon: assets.dashboardIcon},
    {name: "Add Room", path: "/owner/add-room", icon: assets.addIcon},
    {name: "List Room", path: "/owner/list-room", icon: assets.listIcon},
  ]

  return (
    <div className='md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300'>
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end='/owner'
          className={({isActive}) => 
            `flex items-center gap-3 px-4 py-3.5 hover:bg-gray-100 transition-colors
            ${isActive ? 'bg-indigo-100 border-r-4 border-indigo-500 text-indigo-600' : 'text-gray-600'}`
          }
        >
          <img src={item.icon} alt={item.name} className='w-6 h-6'/>
          <p className='md:block hidden'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar