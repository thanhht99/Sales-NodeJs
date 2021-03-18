const mongoose = require("mongoose");
const express = require("express");
const { Schema } = mongoose;

const RatingSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    userEmail: {
        type: mongoose.Schema.Types.String,
        ref: "User",
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: [true, "Rating is required"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Rating", RatingSchema);