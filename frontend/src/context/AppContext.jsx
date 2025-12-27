import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const backendUrl = 'http://localhost:4000'
    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)
    const [role, setRole] = useState(localStorage.getItem('role') ? localStorage.getItem('role') : 'patient')

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('role')
        setToken(false)
        setUserData(false)
        setRole('patient')
    }

    const loadUserProfileData = async () => {
        try {
            const endpoint = role === 'doctor' ? '/api/doctor/profile' : '/api/user/get-profile'
            const { data } = await axios.get(backendUrl + endpoint, { headers: { token } })
            
            if (data.success) {
                setUserData(role === 'doctor' ? data.profileData : data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            if (error.response && (error.response.status === 401 || error.response.data?.message === 'Token Expired')) {
                const refreshToken = localStorage.getItem('refreshToken')
                if (refreshToken) {
                    try {
                        const endpoint = role === 'doctor' ? '/api/doctor/refresh-token' : '/api/auth/refresh-token'
                        const { data } = await axios.post(backendUrl + endpoint, { refreshToken })
                        if (data.success) {
                            localStorage.setItem('token', data.accessToken)
                            setToken(data.accessToken)
                        } else {
                            logout()
                        }
                    } catch (refreshError) {
                        console.log('Refresh token failed', refreshError)
                        logout()
                    }
                } else {
                    logout()
                }
            }
        }
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    const value = {
        doctors, getDoctorsData,
        token, setToken,
        userData, setUserData,
        loadUserProfileData,
        logout,
        backendUrl,
        role, setRole
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider
