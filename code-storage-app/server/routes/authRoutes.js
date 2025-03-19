const express = require('express');
const { login, register, verifyOTP } = require('../controllers/authController');

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for OTP verification
router.post('/verify-otp', verifyOTP);

module.exports = router;