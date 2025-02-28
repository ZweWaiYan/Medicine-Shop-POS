const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');

const {addsale,updatesale,deletesale,fetchsalebyId,fetchsales} = require('../controllers/salesController');

router.post('/addsale',authenticateJWT, addsale);
router.put('/updatesale/:sale_id',authenticateJWT, updatesale);
router.delete('/deletesale/:sale_id',authenticateJWT,deletesale);
router.get('/fetchsale/:saleId',authenticateJWT, fetchsalebyId);
router.get('/fetchsales',authenticateJWT, fetchsales);

module.exports = router;