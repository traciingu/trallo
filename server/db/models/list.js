const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // board: { type: mongoose.Schema.Types.ObjectId, ref: 'boards', required: true },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cards' }]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

// listSchema.virtual('cards', {
//     ref: 'cards',
//     localField: '_id',
//     foreignField: 'list'
// });

module.exports = mongoose.model('List', listSchema);