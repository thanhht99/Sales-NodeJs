const mongoose = require("mongoose");
const express = require("express");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userEmail: {
      type: mongoose.Schema.Types.String,
      ref: "User",
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity can not be less then 1."],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
        },
        total: {
          type: Number,
          required: [true, "Total is required"],
        },
      },
    ],
    orderDate: {
      type: Date,
      default: Date.now(),
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery Address is required"],
    },
    intendedArrivalDate: {
      type: Date,
      default: Date.now(),
    },
    payments: {
      type: String,
      required: [true, "Payments is required"],
    },
    provisional: {
      type: Number,
      required: [true, "Provisional is required"],
    },
    transportFee: {
      type: Number,
      required: [true, "Transport fee is required"],
    },
    totalProduct: {
      default: 0,
      type: Number,
    },
    subTotal: {
      default: 0,
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
