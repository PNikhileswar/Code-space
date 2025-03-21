const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const { authenticate, optional } = require('../middleware/authMiddleware');

router.get('/public', codeController.getAllPublicCodes);
router.get('/by-title/:title', codeController.getCodeByTitle);
router.get('/check-title/:title', codeController.checkTitleExists);
router.get('/search', codeController.searchCodeByTitle);
router.post('/save', optional, codeController.saveCode);
router.post('/:id', codeController.getCodeById);
router.get('/user', authenticate, codeController.getUserCodes);
router.delete('/:id', authenticate, codeController.deleteCodeById);

module.exports = router;