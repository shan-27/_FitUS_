const router = require('express').Router()
const instructorCtrl = require('../controllers/InstructorCtrl')


router.post('/register', instructorCtrl.register)

router.post('/activation', instructorCtrl.activateEmail)


module.exports = router