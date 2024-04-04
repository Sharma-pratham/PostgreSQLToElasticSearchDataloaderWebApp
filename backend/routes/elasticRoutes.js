const express = require('express')

const {transferDatafromPgToElastic} = require('../controller/postgresqlToElasticInsert')
const {searchWithMatch,searchWithFuzzy} = require('../controller/elasticSearchQueue')

const router = express.Router()

router.get('/syncEsData', transferDatafromPgToElastic)
router.get('/search',searchWithMatch)
router.get('/fuzzySearch',searchWithFuzzy)

module.exports = router