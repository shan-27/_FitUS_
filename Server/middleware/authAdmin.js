//Instrucors will promoted as Admins. 

const Instrucors = require('../models/InstructorModel')

const authAdmin = async (req, res, next) => {
    try {
        const instructor = await Instrucors.findOne({_id: req.instructor.id})

        if(instructor.role !== 0) // 0 = admin, 1 = instructor, 2 = member
        return res.status(500).json({msg: "Access denined."})

        next()

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin