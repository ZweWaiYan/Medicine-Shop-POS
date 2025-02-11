const express = require('express');
const router = express.Router();

const {salereport} = require('../controllers/salesController');

router.post('/salesreport', salereport)

module.exports = router;