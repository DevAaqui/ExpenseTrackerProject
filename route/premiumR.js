const path = require('path')

const userAuthentication = require('../middleware/auth')

const express = require('express')

const premiumController = require('../controller/premiumCont')

const router = express.Router()

router.get('/premium/leaderboard', premiumController.leaderboard )

module.exports= router