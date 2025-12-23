import DoctorModel from '../models/doctorModel.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return { accessToken, refreshToken }
}


export const registerDoctor = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        const existingDoctor = await DoctorModel.findOne({ email })
        if (existingDoctor) {
            return res.status(400).json({ success: false, message: 'Doctor already exists' })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newDoctor = new DoctorModel({
            name,
            email,
            password: hashedPassword
        })

        const { accessToken, refreshToken } = generateTokens(newDoctor._id)
        newDoctor.refreshToken = refreshToken
        await newDoctor.save()

        res.status(201).json({
            success: true,
            message: 'Doctor registered successfully',
            accessToken,
            refreshToken,
            doctor: {
                id: newDoctor._id,
                name: newDoctor.name,
                email: newDoctor.email
            }
        })

    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ success: false, message: 'Server error', error: error.message })
    }
}


export const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' })
        }

        const doctor = await DoctorModel.findOne({ email })
        if (!doctor) {
            return res.status(400).json({ success: false, message: 'Doctor not found' })
        }

        const isPasswordMatch = await bcryptjs.compare(password, doctor.password)
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' })
        }

        const { accessToken, refreshToken } = generateTokens(doctor._id)
        
        doctor.refreshToken = refreshToken
        await doctor.save()

        res.status(200).json({
            success: true,
            message: 'Doctor logged in successfully',
            accessToken,
            refreshToken,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                speciality: doctor.speciality,
                degree: doctor.degree,
                available: doctor.available
            }
        })

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ success: false, message: 'Server error', error: error.message })
    }
}


export const googleLogin = async (req, res) => {
    try {
        const { email, name } = req.body

        let doctor = await DoctorModel.findOne({ email })

        if (doctor) {
            const { accessToken, refreshToken } = generateTokens(doctor._id)
            doctor.refreshToken = refreshToken
            await doctor.save()

            res.status(200).json({
                success: true,
                message: 'Logged in with Google successfully',
                accessToken,
                refreshToken,
                doctor: {
                    id: doctor._id,
                    name: doctor.name,
                    email: doctor.email,
                    speciality: doctor.speciality,
                    degree: doctor.degree,
                    available: doctor.available
                }
            })
        } else {
            doctor = new DoctorModel({
                name,
                email,
                password: '' 
            })
            
            const { accessToken, refreshToken } = generateTokens(doctor._id)
            doctor.refreshToken = refreshToken
            await doctor.save()

            res.status(201).json({
                success: true,
                message: 'Registered with Google successfully',
                accessToken,
                refreshToken,
                doctor: {
                    id: doctor._id,
                    name: doctor.name,
                    email: doctor.email,
                    speciality: doctor.speciality,
                    degree: doctor.degree,
                    available: doctor.available
                }
            })
        }

    } catch (error) {
        console.error('Google Login error:', error)
        res.status(500).json({ success: false, message: 'Server error', error: error.message })
    }
}


export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh Token Required' })
        }

        const doctor = await DoctorModel.findOne({ refreshToken })
        if (!doctor) {
            return res.status(403).json({ success: false, message: 'Invalid Refresh Token' })
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Invalid Refresh Token' })
            }
            
            const accessToken = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '15m' })
            res.json({ success: true, accessToken })
        })

    } catch (error) {
        console.error('Refresh Token error:', error)
        res.status(500).json({ success: false, message: 'Server error', error: error.message })
    }
}


export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const doctor = await DoctorModel.findById(decoded.id)

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }

        res.status(200).json({
            success: true,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                speciality: doctor.speciality,
                degree: doctor.degree,
                available: doctor.available
            }
        })

    } catch (error) {
        console.error('Verification error:', error)
        res.status(401).json({ success: false, message: 'Invalid token' })
    }
}

