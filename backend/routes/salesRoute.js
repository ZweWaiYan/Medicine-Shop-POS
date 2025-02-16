const express = require('express');
const router = express.Router();

const {addsale,updatesale,deletesale,fetchsalebyId,fetchsales} = require('../controllers/salesController');

router.post('/addsale', addsale);
router.put('/updatesale/:sale_id', updatesale);
router.delete('/deletesale/:sale_id',deletesale);
router.get('/fetchsale/:sale_id', fetchsalebyId);
router.get('/fetchsales', fetchsales);

module.exports = router;