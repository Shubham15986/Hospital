import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const DoctorProfile = () => {

    const { token, backendUrl, userData, setUserData, getDoctorsData } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)

    const updateProfile = async () => {
        try {
            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('degree', userData.degree)
            formData.append('speciality', userData.speciality)
            formData.append('experience', userData.experience)
            formData.append('about', userData.about)
            formData.append('fees', userData.fees)
            formData.append('available', userData.available)
            formData.append('address', JSON.stringify(userData.address))
            
            if (image) {
                formData.append('image', image)
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                setImage(false)
                // Refresh profile data
                const response = await axios.get(backendUrl + '/api/doctor/profile', { headers: { token } })
                if (response.data.success) {
                    setUserData(response.data.profileData)
                }
                getDoctorsData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return userData && (
        <div className='flex flex-col gap-4 m-5'>
            <div>
                <div className='flex items-center gap-4 mb-4'>
                    <label htmlFor="image">
                        <div className='inline-block relative cursor-pointer'>
                            <img className='w-36 rounded opacity-75 bg-gray-100' src={image ? URL.createObjectURL(image) : (userData.image ? userData.image : assets.upload_icon)} alt="" />
                            {isEdit && !image && <img className='w-10 absolute bottom-12 right-12 bg-gray-200 rounded-full p-2' src={assets.upload_icon} alt="" />}
                        </div>
                        {isEdit && <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />}
                    </label>
                </div>
            </div>

            <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
                {/* ----- Doc Info : name, degree, experience ----- */}
                {isEdit ? (
                    <div className='flex flex-col gap-4 mb-4'>
                        <div>
                            <p className='text-sm font-medium text-gray-600'>Name</p>
                            <input type="text" className='bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full max-w-md' value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
                        </div>
                        <div className='flex gap-4'>
                            <div>
                                <p className='text-sm font-medium text-gray-600'>Degree</p>
                                <input type="text" className='bg-gray-50 border border-gray-300 rounded px-2 py-1' value={userData.degree} onChange={e => setUserData(prev => ({ ...prev, degree: e.target.value }))} />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-gray-600'>Speciality</p>
                                <input type="text" className='bg-gray-50 border border-gray-300 rounded px-2 py-1' value={userData.speciality} onChange={e => setUserData(prev => ({ ...prev, speciality: e.target.value }))} />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-gray-600'>Experience</p>
                                <input type="text" className='bg-gray-50 border border-gray-300 rounded px-2 py-1' value={userData.experience} onChange={e => setUserData(prev => ({ ...prev, experience: e.target.value }))} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className='flex items-center gap-2 text-3xl font-medium text-gray-900'>
                            {userData.name}
                        </p>
                        <div className='flex items-center gap-2 mt-1 text-gray-600'>
                            <p>{userData.degree} - {userData.speciality}</p>
                            <button className='py-0.5 px-2 border text-xs rounded-full'>{userData.experience}</button>
                        </div>
                    </>
                )}

                {/* ----- Doc About ----- */}
                <div>
                    <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>
                        About:
                    </p>
                    {isEdit ? (
                        <textarea className='w-full p-2 bg-gray-50 border border-gray-300 rounded mt-1' rows={5} value={userData.about} onChange={e => setUserData(prev => ({ ...prev, about: e.target.value }))} />
                    ) : (
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            {userData.about}
                        </p>
                    )}
                </div>

                <div className='flex flex-col gap-2 mt-4'>
                    <p className='text-gray-600 font-medium'>
                        Appointment fee: 
                        {isEdit ? (
                            <input type="number" className='bg-gray-50 border border-gray-300 rounded px-2 py-1 ml-2' value={userData.fees} onChange={(e) => setUserData(prev => ({ ...prev, fees: e.target.value }))} />
                        ) : (
                            <span className='text-gray-800 ml-2'>$ {userData.fees}</span>
                        )}
                    </p>
                </div>

                <div className='flex flex-col gap-2 py-2'>
                    <p className='text-gray-600 font-medium'>Address:</p>
                    {isEdit ? (
                        <div className='flex flex-col gap-2'>
                            <input type="text" className='bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full max-w-md' value={userData.address.line1} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} placeholder="Address Line 1" />
                            <input type="text" className='bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full max-w-md' value={userData.address.line2} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} placeholder="Address Line 2" />
                        </div>
                    ) : (
                        <p className='text-sm'>
                            {userData.address.line1}
                            <br />
                            {userData.address.line2}
                        </p>
                    )}
                </div>

                <div className='flex gap-1 pt-2'>
                    <input onChange={() => isEdit && setUserData(prev => ({ ...prev, available: !prev.available }))} checked={userData.available} type="checkbox" name="" id="" />
                    <label htmlFor="">Available</label>
                </div>

                {
                    isEdit
                        ? <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Save</button>
                        : <button onClick={() => setIsEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>
                }

            </div>
        </div>
    )
}

export default DoctorProfile
