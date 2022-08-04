const router = require('express').Router()
const instructorCtrl = require('../controllers/InstructorCtrl')


router.post('/register', instructorCtrl.register)

router.post('/activation', instructorCtrl.activateEmail)

router.post('/login', instructorCtrl.login)

router.post('/refresh_token', instructorCtrl.getAccessToken)

module.exports = router