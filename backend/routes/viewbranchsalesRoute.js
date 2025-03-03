const express = require('express');
const router = express.Router();
const { viewbranchsales,saledetails } = require('../controllers/viewbranchsales');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeAction = require('../middleware/authorizeAction');

router.get('/viewreport/:store',authenticateJWT,authorizeAction('read'), viewbranchsales);
router.get('/viewreport/:store/:saleId',authenticateJWT,authorizeAction('read'), saledetails)

module.exports = router;