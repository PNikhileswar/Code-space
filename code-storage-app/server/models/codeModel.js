const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled Code'
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'javascript'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // CRITICAL FIX: Remove conditional requirement
    },
    isProtected: {
        type: Boolean,
        default: false
    },
    secretKey: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    public: {
        type: Boolean,
        default: true
    }
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;