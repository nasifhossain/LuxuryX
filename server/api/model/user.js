const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    userType: { type: String }
});

module.exports = mongoose.model('User', userSchema);
