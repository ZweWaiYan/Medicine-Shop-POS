const express = require('express');
const router = express.Router();

const { addCategory, fetchCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.post('/addcategory', addCategory);
router.get('/fetchcategory', fetchCategory);
router.put('/updatecategory/:id', updateCategory);
router.delete('/deletecategory/:id', deleteCategory);

module.exports = router;