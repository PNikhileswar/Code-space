const crypto = require('crypto');

class OTPService {
    constructor() {
        this.otpStore = new Map(); // Store OTPs in memory for simplicity
    }

    generateOTP(length = 6) {
        const otp = crypto.randomInt(0, 10 ** length).toString().padStart(length, '0');
        return otp;
    }

    sendOTP(email) {
        const otp = this.generateOTP();
        this.otpStore.set(email, otp);
        // Here you would integrate with a mail service to send the OTP
        console.log(`Sending OTP ${otp} to ${email}`);
        return otp; // For testing purposes
    }

    verifyOTP(email, otp) {
        const storedOtp = this.otpStore.get(email);
        if (storedOtp && storedOtp === otp) {
            this.otpStore.delete(email); // OTP is valid, remove it
            return true;
        }
        return false; // OTP is invalid
    }
}

module.exports = new OTPService();