const router = require("express").Router()
const uploadImg = require('../middleware/uploadImg')
const uploadCtrl = require('../controllers/uploadCtrl')
const authM = require('../middleware/authM')
const authI = require('../middleware/authI')


router.post('/upload_avatar', uploadImg, authM, authI, uploadCtrl.uploadAvatar)

module.exports = router