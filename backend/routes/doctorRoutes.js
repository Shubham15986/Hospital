import express from 'express'
import { doctorList, doctorProfile, updateDoctorProfile, changeAvailablity } from '../controllers/doctorController.js'
import upload from '../middlewares/multer.js'
import authUser from '../middlewares/authUser.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.get('/profile', authUser, doctorProfile)
doctorRouter.post('/update-profile', authUser, upload.single('image'), updateDoctorProfile)
doctorRouter.post('/change-availability', authUser, changeAvailablity)

export default doctorRouter
