const path = require('path')

const bcrypt = require('bcrypt')

const express = require('express')

const userController = require('../controller/userCont')

const router = express.Router()

router.post('/user/login', userController.postLogin)

router.post('/user/signup',userController.postUsers)

router.get('/user/login/404',userController.getUser404)



module.exports = router