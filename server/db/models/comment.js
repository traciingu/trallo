const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.SchemaType.ObjectId, ref: 'Author' },
    list: { type: mongoose.SchemaType.ObjectId, ref: 'List' },
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);