const path = require('path')

const userAuthentication = require('../middleware/auth')

const express = require('express')

const purchaseController = require('../controller/purchaseCont')

const router = express.Router()

router.get('/purchase/premiummembership', userAuthentication.authenticate, purchaseController.purchasepremium )

router.post('/purchase/updatetransactionstatus', userAuthentication.authenticate, purchaseController.updatetransactionstatus)

router.post('/purchase/transactionFailed', userAuthentication.authenticate,purchaseController.transactionFailed)

module.exports = router