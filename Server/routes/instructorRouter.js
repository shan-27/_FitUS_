const router = require('express').Router()
const instructorCtrl = require('../controllers/InstructorCtrl')
const authI = require('../middleware/authI')
const authAdmin = require('../middleware/authAdmin')
const authM = require('../middleware/authM')

router.post('/register', instructorCtrl.register)

router.post('/activation', instructorCtrl.activateEmail)

router.post('/login', instructorCtrl.login)

router.post('/refresh_token', instructorCtrl.getAccessToken)

router.post('/forgotpw', instructorCtrl.forgotPW)

router.post('/resetpw', authI, instructorCtrl.resetPW)

router.get('/info', authI, instructorCtrl.getInstructorInfo)

router.get('/logout', instructorCtrl.logout)

router.get('/allinstructor_info', authI, authAdmin, instructorCtrl.getAllinstructors)

router.get('/allmember_info', authI, authAdmin, instructorCtrl.getAllmembers)

router.patch('/update', authI, instructorCtrl.updateInstructor) 

router.delete('/deleteIns/:id', authI, authAdmin, instructorCtrl.deleteInstructor)

router.delete('/deleteMem/:id', authI, authAdmin, instructorCtrl.deleteMember)
module.exports = router