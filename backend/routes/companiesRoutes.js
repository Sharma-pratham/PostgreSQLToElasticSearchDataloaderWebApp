const express = require('express')

const {getAllCompanies} = require('../controller/companiesController')

const router = express.Router()

router.get('/',getAllCompanies)

module.exports = router