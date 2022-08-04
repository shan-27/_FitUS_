const Instructors = require('../models/InstructorModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')

const CLIENT_URL = process.env.CLIENT_URL

const instructorCtrl = {

    // Instructor Registration
    register: async (req, res) => {
        try {

            const {FirstName, LastName, Email, PhNo, EmgNo, NIC, Password, Address, DoB, Gender } = req.body

            if(!FirstName || !LastName || !Email|| !PhNo|| !Password|| !EmgNo|| !NIC|| !Address|| !DoB|| !Gender)
                return res.status(400).json({msg: "Please fill in all fields."})

            if(!validateEmail(Email))
            return res.status(400).json({msg: "Invalid email."})

            const instructor = await Instructors.findOne({Email})
            if(instructor) return res.status(400).json({msg: "This email already exists"}) 

            if(Password.length < 8)
                return res.status(400).json({msg: "Password must be at least 8 characters"})

            const passwordHash = await bcrypt.hash(Password, 12)

            const newInstructor = {
                FirstName, LastName, Email, PhNo, EmgNo, NIC, Password:passwordHash, Address, DoB, Gender
            }

            const activation_token = createActivationToken(newInstructor)
            
            const url = `${CLIENT_URL}/instructor/activate/${activation_token}`
            sendMail(Email,url, "Verify your email")
            console.log({activation_token})


            console.log({activation_token})
            res.json({msg: "Registration Success! Please activate your account."})

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }

    },

    //Instructor Activation
    activateEmail: async (req, res) => {
        try{
            const {activation_token} = req.body
            const instructor = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            console.log(instructor)

            const {FirstName, LastName, Email, PhNo, EmgNo, NIC, Password, Address, DoB, Gender} = instructor

            const check = await Instructors.findOne({Email})
            if(check) return res.status(400).json({msg:"This email is already exists"})

            const newInstructor = new Instructors({
                FirstName, LastName, Email, PhNo, EmgNo, NIC, Password, Address, DoB, Gender
            })

            await newInstructor.save()
            res.json({msg: "Account has been activated"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    //Instructor Login
  

}

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}


const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = instructorCtrl