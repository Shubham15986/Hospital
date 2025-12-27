import React, { useContext } from 'react'
import { specialityData, assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import SpecialityItem from './SpecialityItem'
import { AppContext } from '../context/AppContext'

const SpecialityMenu = () => {

    const { doctors } = useContext(AppContext)

    // Get unique specialities from doctors
    const doctorSpecialities = doctors.map(doc => doc.speciality)
    const uniqueSpecialities = [...new Set(doctorSpecialities)]

    // Merge with specialityData
    const displayedSpecialities = [...specialityData]

    uniqueSpecialities.forEach(spec => {
        if (!displayedSpecialities.find(item => item.speciality === spec) && spec) {
            displayedSpecialities.push({
                speciality: spec,
                image: assets.General_physician // Fallback image
            })
        }
    })

    return (
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-gray-800'>
            <h1 className='text-3xl font-medium'>Find by Speciality</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll '>
                {displayedSpecialities.map((item, index) => (
                    <SpecialityItem item={item} key={index}/>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu