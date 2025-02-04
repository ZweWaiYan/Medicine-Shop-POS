const express = require('express');
const router = express.Router();
const {allItems} = require('../controllers/allItemController');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorizeRole');

router.get('/allitems', allItems);

module.exports = router;