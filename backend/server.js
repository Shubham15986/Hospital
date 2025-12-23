import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import authRoutes from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import doctorAuthRoutes from './routes/doctorAuthRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'

const app = express()
dotenv.config()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())
connectDB()
connectCloudinary()


app.use('/api/auth', authRoutes)
app.use('/api/user', userRouter)
app.use('/api/doctor', doctorAuthRoutes)
app.use('/api/doctor', doctorRouter)

app.get('/',(req,res)=>{
    res.send('API is  WORKING')
})

app.listen(port, ()=>{
    console.log('port is running')
})