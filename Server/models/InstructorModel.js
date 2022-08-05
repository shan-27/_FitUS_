const mongoose = require('mongoose')

const instructorSchema = new mongoose.Schema({

    FirstName: {
        type: String,
        required: [true, "Please enter your first name"],
        trim: true 
    },
    LastName: {
        type: String,
        required: [true, "Please enter your last name"],
        trim: true 
    },
    Email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        unique: true
    },
    PhNo: {
        type: String,
        required: [true, "Please enter your phone number"],
        trim: true 
    },
    EmgNo: {
        type: String,
        required: [true, "Please enter your emergency phone number"],
        trim: true 
    },
    Password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true 
    },
    NIC: {
        type: String,
        required: [true, "Please enter your NIC"],
        trim: true 
    },
    role: {
        type: Number,
        default: 1 // 0 = admin, 1 = instructor, 2 = member
    },
    Address: {
        type: String,
        required: [true, "Please enter your address"],
        trim: true 
    },
    DoB: {
        type: String,
        required: [true, "Please select your birthday"],
        trim: true 
    },
    Gender: {
        type: String,
        required: [true, "Please select your gender"],
        trim: true 
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/fituscloud/image/upload/v1659693106/FitUS_Avatar/default_avatar_yemfqd.png"
    },

}, {
    timestamps: true
})

module.exports = mongoose.model("Instructors", instructorSchema)