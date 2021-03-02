const mongoose = require('mongoose');
const express = require('express')
const { Schema } = mongoose;

const TokenSchema = new Schema({
    userId: mongoose.Schema.ObjectId,
    email: String,
    token: String,
    expired: String,
});

module.exports = mongoose.model('Token', TokenSchema);