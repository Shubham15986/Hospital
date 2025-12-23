import express from 'express'
import { registerUser, loginUser, verifyToken, googleLogin, refreshToken } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/google-login', googleLogin)
router.post('/refresh-token', refreshToken)
router.get('/verify', verifyToken)

export default router
