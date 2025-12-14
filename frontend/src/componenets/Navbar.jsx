
import React, { useState } from 'react'
import {assets} from '../assets/assets';
import { NavLink } from 'react-router';

function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [token, setToken] = useState(true);
  

  return (
    <div className='flex items-center justify-between py-4 mb-5 border-b border-gray-400'>
         <img className='w-44 cursor-pointer' src={assets.logo} alt="Logo"></img>
         <ul className='hidden md:flex items-center gap-5 font-medium md:ml-8 lg:ml-16'>
            <NavLink to='/'>
                <li className='py-1 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors'>HOME</li>
            </NavLink>
            <NavLink to='/doctors'>
                <li className='py-1 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors'>ALL DOCTORS</li>
            </NavLink>
            <NavLink to='/about'>
                <li className='py-1 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors'>ABOUT</li>
            </NavLink>
            <NavLink to='/contact'>
                <li className='py-1 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors'>CONTACT</li>
            </NavLink>
         </ul>
         {
            token ? 
                <div className='flex items-center gap-4 relative'>
                    <img onClick={() => setShowProfileMenu(!showProfileMenu)} className='w-10 h-10 rounded-full cursor-pointer' src={assets.profile_pic} alt="Profile" />
                    {showProfileMenu && (
                        <div className='absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-10'>
                            <NavLink to='/my-profile' onClick={() => setShowProfileMenu(false)}>
                                <p className='px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors'>My Profile</p>
                            </NavLink>
                            <NavLink to='/my-appointments' onClick={() => setShowProfileMenu(false)}>
                                <p className='px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors border-t border-gray-200'>My Appointments</p>
                            </NavLink>
                            <p onClick={() => {setToken(false); setShowProfileMenu(false)}} className='px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors border-t border-gray-200'>Logout</p>
                        </div>
                    )}
                    <img onClick={() => setShowMenu(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt="Menu" />
                </div>
                :
                <div className='flex items-center gap-4'>
                    <button className='text-white px-8 py-3 rounded-full font-light hidden md:block' style={{backgroundColor: '#5f63f1'}}>Create Account</button>
                    <img onClick={() => setShowMenu(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt="Menu" />
                </div>
         }
         

        {/* Mobile Menu */}
     <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="Logo" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary transition-all'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary transition-all'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary transition-all'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary transition-all'>CONTACT</p></NavLink>
          </ul>
        </div>
    </div>
   
  )
}

export default Navbar