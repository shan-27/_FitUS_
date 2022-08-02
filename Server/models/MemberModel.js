const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({

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
    Password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true 
    },
    role: {
        type: Number,
        default: 2 // 0 = admin, 1 = instructor, 2 = member
    },
    Height: {
        type: String,
        required: [true, "Please enter your height in cm"],
        trim: true 
    },
    Weight: {
        type: String,
        required: [true, "Please enter your weight in kg"],
        trim: true 
    },
    Address: {
        type: String,
        required: [true, "Please enter your adress"],
        trim: true 
    },
    Occupation: {
        type: String,
        required: [true, "Please enter your occupation"],
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
        default: "https://drive.google.com/file/d/1UNorvB3RvqkwM2YfaR5P71POQ9_Mwda9/view?usp=sharing"
    },

}, {
    timestamps: true
})

module.exports = mongoose.model("Members", memberSchema)