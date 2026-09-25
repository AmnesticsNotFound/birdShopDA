const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // If you want to store the user's cart as an array of product IDs
    // cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // If you want cart to hold sub-objects (like product ID and quantity)
    cart: [
        {
            _id: false, // Prevents Mongoose from creating an _id for each subdocument
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            key: { type: Number,required:true},
            requestedAmnt: { type: Number, required: true },
            priceAtPurchase: {type:Number, required:true},
            sizeIndex:{type:Number, required:false},
        },
    ],
    // 
    orders: [
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order' // This MUST match the exact name of your Order model file/export
        }
    ],
    stripeID: { type: String, required: false}
});


module.exports = mongoose.model("User", UserSchema);