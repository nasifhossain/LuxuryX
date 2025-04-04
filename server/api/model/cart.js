const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Unique username
    items: [
        {
            idx: { type: Number, required: true },
            quantity: { type: Number, required: true },
            title:{type:String},
            thumbnail:{type:String,required:true},
            price:{type:Number,required:true},
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);
