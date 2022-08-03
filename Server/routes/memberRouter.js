const router = require('express').Router()
const memberCtrl = require('../controllers/MemberCtrl')


router.post('/register', memberCtrl.register)

router.post('/activation', memberCtrl.activateEmail)

router.post('/login', memberCtrl.login)

module.exports = router