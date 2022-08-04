const Instructors = require('../models/InstructorModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('./sendMail')

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
    login: async (req, res) => {
        try {
            const {Email, Password} = req.body
            const instructor = await Instructors.findOne({Email})
            if(!instructor) return res.status(400).json({msg: "This E-mail does not exist."})
            
            const isMatch = await bcrypt.compare(Password, instructor.Password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            console.log(instructor)
            const refresh_token = createRefreshToken({id: instructor._id})
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/instructor/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days 
            })
            res.json({msg: "Login success!"})
 
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            console.log(rf_token)
            if(!rf_token) return res.status(400).json({msg: "Please login now!"})

            jwt.verify(rf_token, '#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq', (err, instructor) => {
                if(err) return res.status(400).json({msg: "Please login now!"})
                
                const access_token = createAccessToken({id: instructor.id})
                console.log({access_token})
                res.json({access_token})
            })
        } catch (err) {
           return res.status(500).json({msg: err.message}) 
        }
    },

    //Instructor forgot password
    forgotPW: async(req, res) => {
        try{
            const {Email} = req.body
            const instructor = await Instructors.findOne({Email})
            if(!instructor) return res.status(400).json({msg: "This email does not exist."})

            const access_token = createAccessToken({id: instructor._id})
            const url = `${CLIENT_URL}/instructor/reset/${access_token}`
            
            sendEmail(Email, url, "Reset your Instructor account password")
            res.json({msg: "Please check your email to reset your password"})


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
 
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
    return jwt.sign(payload, '#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq', {expiresIn: '7d'})
}

module.exports = instructorCtrl