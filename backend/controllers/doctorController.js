import DoctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
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
        const { fees, address, available, about, degree, experience, speciality, name } = req.body
        const docId = req.docId || req.body.docId
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

// API to get all appointments for doctor panel
export const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
export const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

            // releasing doctor slot
            const { docId, slotDate, slotTime } = appointmentData

            const docData = await DoctorModel.findById(docId)

            let slots_booked = docData.slots_booked

            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

            await DoctorModel.findByIdAndUpdate(docId, { slots_booked })

            res.json({ success: true, message: 'Appointment Cancelled' })

        } else {
            res.json({ success: false, message: 'Cancellation Failed' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to mark appointment completed for doctor panel
export const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })

            res.json({ success: true, message: 'Appointment Completed' })

        } else {
            res.json({ success: false, message: 'Mark Failed' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
export const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

