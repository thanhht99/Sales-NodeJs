const mongoose = require('mongoose');
const express = require('express')
const { Schema } = mongoose;

const VoucherSchema = new Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    voucher: {
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

module.exports = mongoose.model('Voucher', VoucherSchema);