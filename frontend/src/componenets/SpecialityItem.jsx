import React from 'react'
import { Link } from 'react-router-dom'

function SpecialityItem({item,key}) {
    return (
        <Link to={`/doctors/${item.speciality}`} onClick={() => scrollTo(0, 0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={key}>
            <img className='w-16 sm:w-24 mb-2 ' src={item.image} alt="" />
            <p>{item.speciality}</p>
        </Link>
    )
}

export default SpecialityItem