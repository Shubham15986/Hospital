import React, { useState } from 'react'
import { assets } from '../assets/assets'

const MyProfile = () => {


    const userData = {
        name: "Shubham Raj",
        image: assets.profile_pic,
        email: 'abc@gmail.com',
        phone: '+1  123 456 7890',
        address: {
            line1: 'Durgapur',
            line2: 'Bhagalpur',
        },
        gender: 'Male',
        dob: '2005-01-20'
    }

    return (
        <div className='max-w-lg flex flex-col gap-2 text-sm'>
            <img className='w-36 rounded' src={userData.image} alt="" />

             <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
            

            <hr className='bg-zinc-400 h-[1px] border-none' />
            <div>
                <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>Email id:</p>
                    <p className='text-blue-500'>{userData.email}</p>
                    <p className='font-medium'>Phone:</p>
               
                        <p className='text-blue-400'>{userData.phone}</p>
                    <p className='font-medium'>Address:</p>
                  
                         <p className='text-gray-500'>{userData.address.line1} <br /> {userData.address.line2}</p>
                  
                </div>
            </div>
            <div>
                <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>Gender:</p>
               
                        
                     <p className='text-gray-400'>{userData.gender}</p>
                    <p className='font-medium'>Birthday:</p>
                   
                         <p className='text-gray-400'>{userData.dob}</p>
                </div>
            </div>
            
        </div>
    )
}

export default MyProfile