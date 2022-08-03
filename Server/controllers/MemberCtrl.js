const Members = require('../models/MemberModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const { UserRefreshClient } = require('google-auth-library')

const CLIENT_URL = process.env.CLIENT_URL

const memberCtrl = {

    // Member Registration
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

    },

    //Member Activation
    activateEmail: async (req, res) => {
        try{
            const {activation_token} = req.body
            const member = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            console.log(member)

            const {FirstName, LastName, Email, PhNo, Password, Height, Weight, Address, Occupation, DoB, Gender } = member

            const check = await Members.findOne({Email})
            if(check) return res.status(400).json({msg:"This email is already exists"})

            const newMember = new Members({
                FirstName, LastName, Email, PhNo, Password, Height, Weight, Address, Occupation, DoB, Gender
            })

            await newMember.save()
            res.json({msg: "Account has been activated"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    //Member Login
    login:async (req, res) => {
        try {
            const {Email, Password} = req.body
            const member = await Members.findOne({Email})
            if(!member) return res.status(400).json({msg: "This E-mail does not exist."}) 

            const isMatch = await bcrypt.compare(Password, member.Password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            console.log(member)
            const refresh_token = createRefreshToken({id: member._id})
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/member/refresh_token',
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
            if(!rf_token) return res.status(400).json({msg: "Please login now!"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, member) => {
                if(err) return res.status(400).json({msg: "Please login now!"})
                
                const access_token = createAccessToken({id: member.id})
                res.json({access_token})
            })
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

//password check 
//number check 

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, '#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq', {expiresIn: '7d'})
}

module.exports = memberCtrl