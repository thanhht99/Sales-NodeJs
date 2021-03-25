const mongoose = require('mongoose');
const express = require('express')
const { Schema } = mongoose;

const PromotionSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    discount: {
        type: Number,
        required: [true, "Discount is required"],
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Promotion', PromotionSchema);