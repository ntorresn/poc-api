const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: String,
    welcome: Boolean
});

module.exports = mongoose.model('User', userSchema);