const router = require('express').Router()
const memberCtrl = require('../controllers/MemberCtrl')


router.post('/register', memberCtrl.register)

router.post('/activation', memberCtrl.activateEmail)


module.exports = router