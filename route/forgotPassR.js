const path = require('path')

const userAuthentication = require('../middleware/auth')

const express = require('express')

const forgotController = require('../controller/forgotCont')

const router = express.Router()

router.use('/password/updatepassword/:resetpasswordId', forgotController.updatePassword)

router.use('/password/resetpassword/:resetId', forgotController.resetPassword)

router.use('/password/forgotpassword', userAuthentication.authenticate, forgotController.forgotpassword )


module.exports = router
