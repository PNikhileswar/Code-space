// Simple in-memory storage for pending registrations
const pendingRegistrations = new Map();

/**
 * Store registration data temporarily with OTP
 */
exports.storeRegistration = (email, userData, otp) => {
  // Store with expiration (30 minutes)
  const expiration = Date.now() + 30 * 60 * 1000; 
  
  pendingRegistrations.set(email, {
    userData,
    otp,
    expiration
  });
  
  // Clean expired registrations occasionally
  this.cleanupExpired();
};

/**
 * Get pending registration data by email
 */
exports.getRegistration = (email) => {
  const registration = pendingRegistrations.get(email);
  
  if (!registration) {
    return null;
  }
  
  // Check if expired
  if (registration.expiration < Date.now()) {
    pendingRegistrations.delete(email);
    return null;
  }
  
  return registration;
};

/**
 * Remove registration data after successful verification
 */
exports.removeRegistration = (email) => {
  pendingRegistrations.delete(email);
};

/**
 * Clean up expired registrations
 */
exports.cleanupExpired = () => {
  const now = Date.now();
  
  for (const [email, data] of pendingRegistrations.entries()) {
    if (data.expiration < now) {
      pendingRegistrations.delete(email);
    }
  }
};