const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    name:{ type: String, required: true, minLength:2 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description:{ type: String, required: true, minLength:3 },
    rating:{ type: Number, required: true },
    orderID:{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    parrots:{ type:[String], required: true }
});


module.exports = mongoose.model("Reviews", ReviewSchema);