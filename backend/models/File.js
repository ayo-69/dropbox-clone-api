const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    size: {
        type: Number,
    },
    dateUploaded: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('File', fileSchema); // 'files' is the collection name