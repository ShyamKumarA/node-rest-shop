const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");

const orderSchema=mongoose.Schema({
    product:{
        type:ObjectId,
        ref:'Product',
        required:true
    },
    quantity:{
        type:Number,
        default:1
    },

})


module.exports=mongoose.model('Order',orderSchema)