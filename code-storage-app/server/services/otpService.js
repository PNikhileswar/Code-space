const crypto = require('crypto');
const nodemailer = require('nodemailer');

// In-memory OTP storage (you could replace with Redis in production)
const otpStore = new Map();

/**
 * Generate and send OTP to user's email
 */
exports.sendOTP = async (email) => {
  // Generate a 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  
  // Store OTP with 10-minute expiration
  const expiration = Date.now() + 10 * 60 * 1000;
  otpStore.set(email, { otp, expiration });
  
  // Send email with OTP
  try {
    await this.sendEmail(email, otp);
    return otp; // Return for testing/development
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

/**
 * Verify OTP for given email
 */
exports.verifyOTP = (email, submittedOTP) => {
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return false;
  }
  
  // Check if OTP is expired
  if (storedData.expiration < Date.now()) {
    otpStore.delete(email);
    return false;
  }
  
  // Check if OTP matches
  const isValid = storedData.otp === submittedOTP;
  
  // Remove OTP after successful verification
  if (isValid) {
    otpStore.delete(email);
  }
  
  return isValid;
};

/**
 * Send email with OTP code
 */
exports.sendEmail = async (email, otp) => {
  // Fix the transporter to use your environment variables correctly
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    // Add debug option to help troubleshoot
    debug: true
  });
  
  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'CodeSpace Account Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">Verify Your CodeSpace Account</h2>
        <p>Thank you for registering with CodeSpace. To complete your registration, please use the verification code below:</p>
        <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #1F2937; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, you can safely ignore this email.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #6B7280;">© CodeSpace ${new Date().getFullYear()}</p>
      </div>
    `
  };
  
  // Send email
  return transporter.sendMail(mailOptions);
};