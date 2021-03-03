const mongoose = require("mongoose");
const express = require("express");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    deliveryAddress: {
      type: String,
      required: [true, "Delivery Address is required"],
    },
    fromOfDelivery: {
      type: String,
      required: [true, "From Of Delivery is required"],
    },
    payments: {
      type: String,
      required: [true, "Payments is required"],
    },
    provisional: {
      type: String,
      required: [true, "Provisional is required"],
    },
    transportFee: {
      type: Number,
      required: [true, "Transport fee is required"],
    },
    subTotal: {
      type: Number,
      required: [true, "Sub Total is required"],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
