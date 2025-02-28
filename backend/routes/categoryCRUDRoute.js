const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const { addCategory, fetchCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.post('/addcategory',authenticateJWT, addCategory);
router.get('/fetchcategory',authenticateJWT, fetchCategory);
router.put('/updatecategory/:id',authenticateJWT, updateCategory);
router.delete('/deletecategory/:id',authenticateJWT, deleteCategory);

module.exports = router;