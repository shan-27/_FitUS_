const router = require('express').Router()
const memberCtrl = require('../controllers/MemberCtrl')


router.post('/register', memberCtrl.register)


module.exports = router