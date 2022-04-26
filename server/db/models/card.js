const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    // list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

module.exports = mongoose.model('Card', cardSchema);
