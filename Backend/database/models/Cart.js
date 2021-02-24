const mongoose = require('mongoose');
const express = require('express')
const { Schema } = mongoose;

const ItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.']
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    total: {
        type: Number,
        required: [true, "Total is required"],
    }
}, {
    timestamps: true,
})

const CartSchema = new Schema({
    items: [ItemSchema],
    subTotal: {
        default: 0,
        type: Number
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Cart', CartSchema);