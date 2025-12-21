import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import DoctorCard from './DoctorCard'

const RelatedDoctors = ({ speciality, docId }) => {


    const { doctors } = useContext(AppContext)

    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDoc(doctorsData)
        }
    }, [doctors, speciality, docId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900'>
            <h1 className='text-3xl font-medium'>Related Doctors</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {relDoc.map((item, index) => (
                   <DoctorCard item={item} index={index} key={item._id}/>
                ))}
            </div>
        </div>
    )
}

export default RelatedDoctors