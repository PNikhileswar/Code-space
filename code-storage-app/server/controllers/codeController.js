const Code = require('../models/codeModel');
const bcrypt = require('bcryptjs');

// Save a new code
exports.saveCode = async (req, res) => {
    try {
        console.log("💾 SaveCode controller called");
        const { title, code, language, isProtected, secretKey, public } = req.body;
        
        console.log("Save details:", { 
            title, 
            hasUser: !!req.user, 
            userId: req.user?.id || 'none',
            public: public === false ? 'private' : 'public'
        });
        
        // For private codes, ensure user is authenticated
        if (public === false && !req.user) {
            return res.status(401).json({ message: 'Authentication required for private codes' });
        }
        
        try {
            // CRITICAL FIX: Use direct document creation instead of intermediate object
            const newCode = new Code({
                title: title || 'Untitled Code',
                code: code || '',
                language: language || 'javascript',
                isProtected: !!isProtected,
                public: public !== false
            });
            
            // Only set userId if user is authenticated
            if (req.user) {
                newCode.userId = req.user.id;
                console.log("Setting userId:", req.user.id);
            }

            // Handle secret key if needed
            if (isProtected && secretKey) {
                const salt = await bcrypt.genSalt(10);
                newCode.secretKey = await bcrypt.hash(secretKey, salt);
            }

            console.log("Attempting to save document...");
            const savedCode = await newCode.save();
            console.log("✅ Code saved successfully with ID:", savedCode._id);
            
            // Return code without the secretKey
            const responseCode = savedCode.toObject();
            delete responseCode.secretKey;
            
            return res.status(201).json({ 
                message: 'Code saved successfully', 
                code: responseCode,
                id: savedCode._id
            });
        } catch (dbError) {
            console.error("❌ Database error:", dbError);
            return res.status(400).json({
                message: 'Error saving code to database',
                details: dbError.message
            });
        }
    } catch (error) {
        console.error('❌ Error in saveCode controller:', error);
        return res.status(500).json({ 
            message: 'Server error during save operation',
            error: error.message 
        });
    }
};

// Get a code by ID (with optional secret key verification)
exports.getCodeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { secretKey } = req.body;
        
        const code = await Code.findById(id);
        
        if (!code) {
            return res.status(404).json({ message: 'Code not found' });
        }
        
        // Check if user has access to this code
        const isOwner = req.user && code.userId && req.user.id === code.userId.toString();
        
        // If code is protected and user is not the owner, verify secret key
        if (code.isProtected && !isOwner) {
            if (!secretKey) {
                return res.status(403).json({ 
                    message: 'This code is protected with a secret key',
                    requiresKey: true
                });
            }
            
            const isValidKey = await bcrypt.compare(secretKey, code.secretKey);
            if (!isValidKey) {
                return res.status(403).json({ 
                    message: 'Invalid secret key',
                    requiresKey: true
                });
            }
        }
        
        // Return code without the secretKey
        const responseCode = code.toObject();
        delete responseCode.secretKey;
        
        res.status(200).json(responseCode);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving code', error: error.message });
    }
};

// Get all public codes
exports.getAllPublicCodes = async (req, res) => {
    try {
        const codes = await Code.find({ public: true })
            .select('-secretKey')
            .sort({ createdAt: -1 });
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving codes', error: error.message });
    }
};

// Get user's codes
exports.getUserCodes = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        
        const codes = await Code.find({ userId: req.user.id })
            .select('-secretKey')
            .sort({ createdAt: -1 });
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user codes', error: error.message });
    }
};

// Delete a code by ID
exports.deleteCodeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the code
        const code = await Code.findById(id);
        
        if (!code) {
            return res.status(404).json({ message: 'Code not found' });
        }
        
        // Check if user owns this code
        if (code.userId && req.user.id !== code.userId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this code' });
        }
        
        // Delete the code
        await Code.findByIdAndDelete(id);
        
        res.status(200).json({ message: 'Code deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting code', error: error.message });
    }
};

// Add this function to your existing controller
exports.searchCodeByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        
        if (!title) {
            return res.status(400).json({ message: 'Search title is required' });
        }
        
        // Search for codes with matching title (case-insensitive)
        const codes = await Code.find({
            title: { $regex: new RegExp(title, 'i') },
            public: true // Only search public codes unless user is authenticated
        })
        .select('-secretKey')
        .limit(10); // Limit results to avoid performance issues
        
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ message: 'Error searching for codes', error: error.message });
    }
};

// Add this function to your existing controller

exports.getCodeByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    // Find code with exact title match (case insensitive)
    const code = await Code.findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') }
    }).select('-secretKey');
    
    if (!code) {
      return res.status(404).json({ message: 'Code not found' });
    }
    
    // Check if code is protected
    if (code.isProtected) {
      return res.status(403).json({ 
        message: 'This code is protected', 
        requiresKey: true,
        _id: code._id,
        isProtected: true
      });
    }
    
    res.status(200).json(code);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving code', error: error.message });
  }
};