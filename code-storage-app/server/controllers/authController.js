const User = require('../models/userModel');
const OtpService = require('../services/otpService');
const MailService = require('../services/mailService');

// Register a new user
exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = new User({ email, password });
        await user.save();

        // Send OTP for verification
        const otp = OtpService.generateOtp();
        await MailService.sendOtp(email, otp);

        res.status(201).json({ message: 'User registered successfully. Please verify your OTP.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const isValid = OtpService.verifyOtp(email, otp);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};