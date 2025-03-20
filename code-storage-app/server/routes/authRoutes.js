const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for OTP verification
router.post('/verify-otp', authController.verifyOTP);

// Route for resending OTP
router.post('/resend-otp', authController.resendOTP);

module.exports = router;