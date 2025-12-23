import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ""
    },
    speciality: {
        type: String,
        default: ""
    },
    degree: {
        type: String,
        default: ""
    },
    experience: {
        type: String,
        default: ""
    },
    about: {
        type: String,
        default: ""
    },
    available: {
        type: Boolean,
        default: true
    },
    fees: {
        type: Number,
        default: 0
    },
    address: {
        type: Object,
        default: {
            line1: '',
            line2: ''
        }
    },
    date: {
        type: Number,
        default: Date.now
    },
    slots_booked: {
        type: Object,
        default: {},
    },
    refreshToken: {
        type: String
    }
}, { minimize: false })

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema)

export default doctorModel