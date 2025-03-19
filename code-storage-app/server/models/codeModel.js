const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Not required for public codes
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d' // Optional: Automatically delete codes older than 30 days
    }
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;