import jwt from 'jsonwebtoken'

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        let token = req.headers.token
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        
        if (!req.body) {
            req.body = {}
        }
        
        req.body.docId = token_decode.id
        req.docId = token_decode.id // Also attach to req object directly to survive multer
        next()
    } catch (error) {
        console.log(error.message)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token Expired' })
        }
        res.json({ success: false, message: error.message })
    }
}

export default authDoctor
