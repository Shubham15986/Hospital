import express from 'express'
import { registerDoctor, loginDoctor, verifyToken, refreshToken, googleLogin } from '../controllers/doctorAuthController.js'

const router = express.Router()

router.post('/register', registerDoctor)
router.post('/login', loginDoctor)
router.post('/google-login', googleLogin)
router.post('/refresh-token', refreshToken)
router.get('/verify', verifyToken)

export default router
