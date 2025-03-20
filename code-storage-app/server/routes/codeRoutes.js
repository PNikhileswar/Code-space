const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const { authenticate, optional } = require('../middleware/authMiddleware');

// Public routes
router.get('/public', codeController.getAllPublicCodes);
router.get('/by-title/:title', codeController.getCodeByTitle);
router.post('/:id', codeController.getCodeById);
router.get('/search', codeController.searchCodeByTitle);

// CRITICAL FIX: Use optional middleware for save route
router.post('/save', optional, codeController.saveCode);

// Protected routes
router.get('/user', authenticate, codeController.getUserCodes);
router.delete('/:id', authenticate, codeController.deleteCodeById);

module.exports = router;