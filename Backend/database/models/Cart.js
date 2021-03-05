const mongoose = require("mongoose");
const express = require("express");
const { Schema } = mongoose;

const CartSchema = new Schema({
  userEmail: {
    type: mongoose.Schema.Types.String,
    ref: "User",
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
  totalProduct: {
    default: 0,
    type: Number,
  },
  subTotal: {
    default: 0,
    type: Number,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
