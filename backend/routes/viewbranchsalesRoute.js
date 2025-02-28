const express = require('express');
const router = express.Router();
const { viewbranchsales,saledetails } = require('../controllers/viewbranchsales');
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/viewreport/:store',authenticateJWT, viewbranchsales);
router.get('/viewreport/:store/:saleId',authenticateJWT, saledetails)

module.exports = router;