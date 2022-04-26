const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    background: String,
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'list' }]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Board', boardSchema);