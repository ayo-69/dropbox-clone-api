const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    hashName: {
        type: String,
        unique: true, // Ensure that the hash name is unique
    },
    size: {
        type: Number,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
    },
    dateUploaded: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('File', fileSchema); // 'files' is the collection name