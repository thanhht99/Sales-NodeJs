const mongoose = require("mongoose");
const express = require("express");
const { Schema } = mongoose;

const TokenSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: String,
  token: String,
  expired: String,
});

module.exports = mongoose.model("Token", TokenSchema);
