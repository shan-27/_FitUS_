const Members = require('../models/MemberModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')

const CLIENT_URL = process.env.CLIENT_URL

const memberCtrl = {
    register: async (req, res) => {
        try {
            const {FirstName, LastName, Email, PhNo, Password, Height, Weight, Address, Occupation, DoB, Gender } = req.body
            
            if(!FirstName || !LastName || !Email|| !PhNo|| !Password|| !Height|| !Weight|| !Address|| !Occupation|| !DoB|| !Gender)
                return res.status(400).json({msg: "Please fill in all fields."})
            

            if(!validateEmail(Email))
                return res.status(400).json({msg: "Invalid email."})


            const member = await Members.findOne({Email})
            if(member) return res.status(400).json({msg: "This email already exists"})


            if(Password.length < 8)
                return res.status(400).json({msg: "Password must be at least 8 characters"})


            const passwordHash = await bcrypt.hash(Password, 12)
            

            const newMember = {
                FirstName, LastName, Email, PhNo, Password: passwordHash, Height, Weight, Address, Occupation, DoB, Gender
            }
            

            const activation_token = createActivationToken(newMember)

            const url = `${CLIENT_URL}/member/activate/${activation_token}`
            sendMail(Email,url)
            console.log({activation_token})

            res.json({msg: "Registration Success! Please activate your account."})

        } catch(err) {
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
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = memberCtrl