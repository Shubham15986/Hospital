import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return { accessToken, refreshToken }
}


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        const { accessToken, refreshToken } = generateTokens(newUser._id)
        newUser.refreshToken = refreshToken
        await newUser.save()

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            accessToken,
            refreshToken,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })

    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ success: false, message: 'Server error', error: error.message })
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' })
        }

        const isPasswordMatch = await bcryptjs.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' })
        }

        const { accessToken, refreshToken } = generateTokens(user._id)
        
        
        user.refreshToken = refreshToken
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
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

        let user = await User.findOne({ email })

        if (user) {
            const { accessToken, refreshToken } = generateTokens(user._id)
            user.refreshToken = refreshToken
            await user.save()

            res.status(200).json({
                success: true,
                message: 'Logged in with Google successfully',
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
        } else {
            user = new User({
                name,
                email,
                password: '' 
            })
            
            const { accessToken, refreshToken } = generateTokens(user._id)
            user.refreshToken = refreshToken
            await user.save()

            res.status(201).json({
                success: true,
                message: 'Registered with Google successfully',
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
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

        const user = await User.findOne({ refreshToken })
        if (!user) {
            return res.status(403).json({ success: false, message: 'Invalid Refresh Token' })
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Invalid Refresh Token' })
            }
            
            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' })
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
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.error('Verification error:', error)
        res.status(401).json({ success: false, message: 'Invalid token' })
    }
}
