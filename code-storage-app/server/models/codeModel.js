const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
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
        // Only required for private codes
        required: function() {
            return this.public === false;
        }
    },
    isProtected: {
        type: Boolean,
        default: false
    },
    secretKey: {
        type: String,
        // Only required if code is protected
        required: function() {
            return this.isProtected === true;
        }
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

// Index for faster searches
codeSchema.index({ title: 1 });
codeSchema.index({ userId: 1 });
codeSchema.index({ public: 1 });

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;