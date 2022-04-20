const mongoose = require('mongoose');

// TODO: Allow custom profile image
const authorSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true}
    // profileImage: {type: String} 
});

module.exports = mongoose.model('Author', authorSchema);