// dependencies
const mongoose = require('mongoose');

// Create Model
const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    email: String,
    mobile: Number,
    password: String,
    address: String,
    messages: [Object]
});

module.exports = mongoose.model('user', User);