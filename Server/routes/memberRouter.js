const router = require('express').Router()
const memberCtrl = require('../controllers/MemberCtrl')
const authM = require('../middleware/authM')

router.post('/register', memberCtrl.register)

router.post('/activation', memberCtrl.activateEmail)

router.post('/login', memberCtrl.login)

router.post('/refresh_token', memberCtrl.getAccessToken)

router.post('/forgotpw', memberCtrl.forgotPW)

router.post('/resetpw', authM, memberCtrl.resetPW)

router.get('/info', authM, memberCtrl.getMemberInfo)

module.exports = router