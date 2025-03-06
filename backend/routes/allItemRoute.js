const express = require('express');
const router = express.Router();
const {allItems} = require('../controllers/allItemController');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorizeRole');
const authorizeAction = require('../middleware/authorizeAction');
const {getUserStore} = require('../controllers/getuserstore');

router.get('/allitems',authenticateJWT,authorizeAction('read'), allItems);
router.get('/getbranch', authenticateJWT,authorizeAction('read'), getUserStore);

module.exports = router;