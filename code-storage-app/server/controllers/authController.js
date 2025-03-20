const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpService = require('../services/otpService');
const tempStorage = require('../services/tempStorageService');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      try {
        // Try to generate OTP and send email
        const otp = await otpService.sendOTP(email);
        
        // Store registration data temporarily
        tempStorage.storeRegistration(email, { 
          email, 
          password: hashedPassword 
        }, otp);
        
        // Return success response
        res.status(200).json({ 
          message: 'Verification code sent to your email', 
          email,
          // For development only: include OTP in response
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
      } catch (emailError) {
        console.error('Email sending failed, creating user directly:', emailError);
        
        // Create verified user directly without email verification
        const newUser = new User({
          email,
          password: hashedPassword,
          isVerified: true // Skip verification for now
        });
        
        await newUser.save();
        
        // Generate token
        const token = jwt.sign(
          { id: newUser._id },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        // Return success with token
        res.status(201).json({
          message: 'Registration completed successfully (email verification skipped)',
          token,
          user: {
            id: newUser._id,
            email: newUser.email
          }
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  },
  
  // Verify OTP and complete registration
  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
      }
      
      // Verify OTP
      const isValid = otpService.verifyOTP(email, otp);
      
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid or expired verification code' });
      }
      
      // Get registration data from temporary storage
      const registration = tempStorage.getRegistration(email);
      
      if (!registration) {
        return res.status(400).json({ 
          message: 'Registration session expired. Please register again.' 
        });
      }
      
      // Create user in database now that email is verified
      const newUser = new User({
        email: registration.userData.email,
        password: registration.userData.password,
        isVerified: true // User is verified at creation
      });
      
      await newUser.save();
      
      // Remove from temporary storage
      tempStorage.removeRegistration(email);
      
      // Generate token
      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return success with token
      res.status(201).json({
        message: 'Registration completed successfully',
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          isVerified: true
        }
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ message: 'Server error during verification' });
    }
  },
  
  // Resend OTP
  resendOTP: async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Check if pending registration exists
      const registration = tempStorage.getRegistration(email);
      
      if (!registration) {
        return res.status(404).json({ 
          message: 'Registration session expired. Please register again.' 
        });
      }
      
      // Generate and send new OTP
      const newOtp = await otpService.sendOTP(email);
      
      // Update OTP in temporary storage
      tempStorage.storeRegistration(
        email, 
        registration.userData, 
        newOtp
      );
      
      res.status(200).json({ message: 'Verification code resent successfully' });
    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  // Login user - keep as is
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find the user
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check if email is verified
      if (!user.isVerified) {
        // Generate new OTP for convenience
        const otp = require('../services/otpService').sendOTP(email);
        
        return res.status(403).json({ 
          message: 'Email verification required',
          verificationNeeded: true,
          email: user.email // Send back email for verification form
        });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
};

module.exports = authController;