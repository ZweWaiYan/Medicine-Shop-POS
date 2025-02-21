const express = require('express');
const router = express.Router();
const { viewbranchsales,saledetails } = require('../controllers/viewbranchsales');

router.get('/viewreport/:store', viewbranchsales);
router.get('/viewreport/:store/:saleId', saledetails)

module.exports = router;