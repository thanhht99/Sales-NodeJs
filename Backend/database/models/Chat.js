const mongoose = require('mongoose');
const express = require('express')
const { Schema } = mongoose;

const ChatSchema = new Schema({
    emailReceiver: {
        type: String,
        required: [true, "Email is required"],
    },
    messages: {
        type: String,
        required: [true, "Messages is required"]
    },
    emailSender: {
        type: String,
        required: [true, "Email is required"],
    }
});

module.exports = mongoose.model('Chat', ChatSchema);