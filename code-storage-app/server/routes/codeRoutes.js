const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const { authenticate, optional } = require('../middleware/authMiddleware');

// Public routes
router.get('/public', codeController.getAllPublicCodes);
router.get('/by-title/:title', codeController.getCodeByTitle);
router.get('/search', codeController.searchCodeByTitle);

// CRITICAL FIX: Define the save route BEFORE the :id route
router.post('/save', optional, codeController.saveCode);

// Now define the wildcard route AFTER the specific routes
router.post('/:id', codeController.getCodeById);

// Protected routes
router.get('/user', authenticate, codeController.getUserCodes);
router.delete('/:id', authenticate, codeController.deleteCodeById);

module.exports = router;