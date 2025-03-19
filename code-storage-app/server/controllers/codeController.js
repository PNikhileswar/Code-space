const Code = require('../models/codeModel');

// Save a new code
exports.saveCode = async (req, res) => {
    try {
        const { code, userId } = req.body;
        const newCode = new Code({ code, userId });
        await newCode.save();
        res.status(201).json({ message: 'Code saved successfully', code: newCode });
    } catch (error) {
        res.status(500).json({ message: 'Error saving code', error });
    }
};

// Get all codes (public)
exports.getAllCodes = async (req, res) => {
    try {
        const codes = await Code.find();
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving codes', error });
    }
};

// Get user's codes (private)
exports.getUserCodes = async (req, res) => {
    try {
        const { userId } = req.params;
        const codes = await Code.find({ userId });
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user codes', error });
    }
};