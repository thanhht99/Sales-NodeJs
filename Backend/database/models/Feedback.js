const mongoose = require("mongoose");
const express = require("express");
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    userEmail: {
        type: mongoose.Schema.Types.String,
        ref: "User",
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
    },
    contentFeedback: {
        type: String,
        required: [true, "Content Feedback is required"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Feedback", FeedbackSchema);