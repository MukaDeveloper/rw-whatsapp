const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    instance: {
        type: Number,
        required: true,
        default: 0,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Users', userSchema);