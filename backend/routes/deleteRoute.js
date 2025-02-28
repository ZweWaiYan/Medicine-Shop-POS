const express = require('express');
const router = express.Router();
const {deleteitem} = require('../controllers/deleteController');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorizeRole');

//router.delete('/deleteitem/:item_id',authenticateJWT,authorizeRole(['admin','pharmacist']), deleteitem);
router.delete('/deleteitem/:item_id',authenticateJWT, deleteitem);

module.exports = router;