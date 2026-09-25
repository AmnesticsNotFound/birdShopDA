const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },// This MUST match the exact name of your Order model file/export
    products:[
        {
            _id: false, // Prevents Mongoose from creating an _id for each subdocument
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            requestedAmnt: { type: Number, default: 1 },
            priceAtPurchase: {type:Number, required:true}
        }
    ],
    date: { type: Date, default: Date.now },
    total:{ type: Number, default: 0},
    parrots:{type: [String], required:false},
    stripeSessionID: { type: String, required: true, unique:true}

    
});

// 🧮 THE FORMULA: Function runs right before saving the order
OrderSchema.pre('save', function (next) {
    // 'this' refers to the current order document
    if (this.products && this.products.length > 0) {
        this.total = this.products.reduce((sum, item) => {
            return sum + (item.priceAtPurchase * item.quantity);
        }, 0);
    } else {
        this.total = 0;
    }
    
    next(); // Tell Mongoose to proceed with saving
});

module.exports = mongoose.model("Order", OrderSchema);
