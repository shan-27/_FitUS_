const router = require('express').Router()
const memberCtrl = require('../controllers/MemberCtrl')


router.post('/register', memberCtrl.register)

router.post('/activation', memberCtrl.activateEmail)

router.post('/login', memberCtrl.login)

router.post('/refresh_token', memberCtrl.getAccessToken)

router.post('/forgotpw', memberCtrl.forgotPW)

module.exports = router