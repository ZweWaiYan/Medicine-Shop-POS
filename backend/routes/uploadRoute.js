const express = require('express');
const router = express.Router();
const {upload} = require('../controllers/uploadController');
const handleImageUpload = require('../middleware/handleImageUpload');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorizeRole');

router.post('/upload',authenticateJWT, handleImageUpload,upload);

module.exports = router;