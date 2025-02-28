const express = require('express');
const router = express.Router();
const {update} = require('../controllers/updateController');
const handleImageUpload = require('../middleware/handleImageUpload');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorizeRole');

router.put('/update/:item_id',authenticateJWT, handleImageUpload,update);

module.exports = router;