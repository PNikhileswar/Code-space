const Code = require('../models/codeModel');
const bcrypt = require('bcryptjs');

// Save a new code or update an existing code
exports.saveCode = async (req, res) => {
    try {
        const { _id, title, code, language, isProtected, secretKey, public } = req.body;

        console.log("📝 Save request received:", {
            title,
            isPrivate: public === false,
            hasToken: !!req.headers.authorization,
            hasUser: !!req.user,
            userId: req.user ? req.user.id : 'Not authenticated'
        });

        // Ensure private codes require authentication
        if (public === false && !req.user) {
            return res.status(401).json({ message: 'Authentication required for private codes' });
        }

        // Validate input
        if (!title || typeof title !== 'string') {
            return res.status(400).json({ message: 'Title must be a valid string' });
        }

        // Create new code object
        const newCode = new Code({
            title: title.trim() || 'Untitled Code',
            code: code || '',
            language: language || 'javascript',
            isProtected: !!isProtected,
            public: public !== false, // Default to public
            ...(req.user ? { userId: req.user.id } : {})
        });

        console.log("Creating new code:", {
            title: newCode.title,
            isPublic: newCode.public,
            hasUserId: !!newCode.userId
        });

        // Handle protected code encryption
        if (newCode.isProtected && secretKey) {
            const salt = await bcrypt.genSalt(10);
            newCode.secretKey = await bcrypt.hash(secretKey, salt);
        }

        await newCode.save();
        const responseObj = newCode.toObject();
        delete responseObj.secretKey;

        return res.status(201).json({
            message: 'Code saved successfully',
            code: responseObj,
            id: newCode._id
        });

    } catch (error) {
        console.error('Error in saveCode controller:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
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

        const isOwner = req.user && code.userId && req.user.id === code.userId.toString();

        // Verify secret key if the code is protected
        if (code.isProtected && !isOwner) {
            if (!secretKey) {
                return res.status(403).json({ message: 'This code is protected', requiresKey: true });
            }
            const isValidKey = await bcrypt.compare(secretKey, code.secretKey);
            if (!isValidKey) {
                return res.status(403).json({ message: 'Invalid secret key', requiresKey: true });
            }
        }

        const responseCode = code.toObject();
        delete responseCode.secretKey;

        res.status(200).json(responseCode);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving code', error: error.message });
    }
};

// Get all public codes (with pagination)
exports.getAllPublicCodes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Pagination support

        const codes = await Code.find({ public: true })
            .select('-secretKey')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving codes', error: error.message });
    }
};

// Get codes created by the logged-in user
exports.getUserCodes = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
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

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const code = await Code.findById(id);
        if (!code) {
            return res.status(404).json({ message: 'Code not found' });
        }

        if (code.userId && req.user.id !== code.userId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this code' });
        }

        await Code.findByIdAndDelete(id);
        res.status(200).json({ message: 'Code deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting code', error: error.message });
    }
};

// Search for codes by title
exports.searchCodeByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) {
            return res.status(400).json({ message: 'Search title is required' });
        }

        const query = { title: { $regex: new RegExp(title, 'i') } };
        if (!req.user) query.public = true;  // Only show private codes to authenticated users

        const codes = await Code.find(query)
            .select('-secretKey')
            .limit(10);

        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ message: 'Error searching for codes', error: error.message });
    }
};

// Get a code by exact title
exports.getCodeByTitle = async (req, res) => {
    try {
        const { title } = req.params;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const code = await Code.findOne({ title }).select('-secretKey');
        if (!code) {
            return res.status(404).json({ message: 'Code not found' });
        }

        if (code.isProtected) {
            return res.status(403).json({ message: 'This code is protected', requiresKey: true, _id: code._id, isProtected: true });
        }

        res.status(200).json(code);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving code', error: error.message });
    }
};
