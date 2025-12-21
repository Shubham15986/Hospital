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
    }
    ,speciality: {
        type: String,
        required: true,
    },
    image: {
        type: String, default: ""
    },
    degree: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    }, available: {
        type: Boolean,
        required: true,
    },fees: {
        type: Number,
        required: true,
     
    },
    date: {
        type: Number,
        required: true,
    }
    ,slots_book: {
        type:Object,
        default: {},
    }

}, {minimize: false})

const doctorModel = mongoose.models.doctor ||  mongoose.model('doctor', doctorSchema)

export default doctorModel