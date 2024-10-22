const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    quantity: Number,
});

module.exports = mongoose.model('Product', productSchema);