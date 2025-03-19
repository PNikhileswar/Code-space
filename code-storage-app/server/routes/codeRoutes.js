const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// Route to save a new code
router.post('/codes', codeController.saveCode);

// Route to get all codes (public access)
router.get('/codes', codeController.getAllCodes);

// Route to get a specific code by ID (authenticated access)
router.get('/codes/:id', codeController.getCodeById);

// Route to delete a specific code by ID (authenticated access)
router.delete('/codes/:id', codeController.deleteCodeById);

module.exports = router;