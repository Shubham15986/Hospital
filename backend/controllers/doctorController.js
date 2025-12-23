import DoctorModel from '../models/doctorModel.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cloudinary from 'cloudinary'

export const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await DoctorModel.findById(docId)
        await DoctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availability Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export const doctorList = async (req, res) => {
    try {
        const doctors = await DoctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const profileData = await DoctorModel.findById(docId).select('-password')
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available, about, degree, experience, speciality, name } = req.body
        const imageFile = req.file

        if (!name || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await DoctorModel.findByIdAndUpdate(docId, {
            name,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            available
        })

        if (imageFile) {

            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await DoctorModel.findByIdAndUpdate(docId, { image: imageURL })
        }

        res.json({ success: true, message: "Profile Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
