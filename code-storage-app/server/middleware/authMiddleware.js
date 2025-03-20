const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Required authentication - will return 401 if no valid token
exports.authenticate = async (req, res, next) => {
    try {
        console.log("⭐ Auth middleware called for path:", req.path);
        
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log("❌ No token provided in request");
            return res.status(401).json({ message: 'Authentication required. No token provided.' });
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("✅ Token decoded successfully, user ID:", decoded.id);
            
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                console.log("❌ User not found with ID:", decoded.id);
                return res.status(401).json({ message: 'User not found' });
            }
            
            console.log("✅ User authenticated successfully:", user.email);
            req.user = user;
            next();
        } catch (jwtError) {
            console.error('❌ JWT verification error:', jwtError);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('❌ Auth middleware error:', error);
        return res.status(500).json({ message: 'Server error in authentication' });
    }
};

// Optional authentication - will continue without error if no token
exports.optional = async (req, res, next) => {
    try {
        console.log("Optional auth middleware called");
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log("No token - continuing as unauthenticated");
            return next(); // Continue without user info
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Optional auth token decoded for user:", decoded.id);
            
            const user = await User.findById(decoded.id).select('-password');
            
            if (user) {
                console.log("User authenticated in optional middleware:", user.email);
                req.user = user;
            }
            next();
        } catch (jwtError) {
            // Don't fail, just continue without authentication
            console.log("JWT error in optional auth - continuing as unauthenticated");
            next();
        }
    } catch (error) {
        console.error("Error in optional auth middleware:", error);
        next(); // Continue anyway
    }
};