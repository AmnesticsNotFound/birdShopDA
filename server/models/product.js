const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    key:{ type: Number },
    name:{ type: String, required: true },
    description:{ type: String, required: true },
    quantity:{ type: Number, required: false },
    quantityArray:{ type: Array, required: false },
    images:{ type: Array, required: true },
    //otherImages:{ type: [[String]], required: false },
    price:{ type: Number, required: false },
    priceArray:{ type: Array, required: false },
    sizeArray:{type: [String], required:false, enum:['Nible','Crumble','Small','Medium','Large']},
    category:{type:String, required:true, enum:['Parrot', 'Food', 'Accessory']},
    

    
});


module.exports = mongoose.model("Product", ProductSchema);
