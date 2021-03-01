const mongoose = require('mongoose');
const express = require('express')
const { Schema } = mongoose;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const ChatSchema = new Schema({
    emailReceiver: {
        type: String,
        required: [true, "Email Receiver is required"],
        trim: true,
        lowercase: true,
        minlength: [10, "Email musts have more than 10 characters"],
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    messages: {
        type: String,
        required: [true, "Messages is required"]
    },
    emailSender: {
        type: String,
        required: [true, "Email Sender is required"],
        trim: true,
        lowercase: true,
        minlength: [10, "Email musts have more than 10 characters"],
        validate: [validateEmail, 'Please fill a valid email address'],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);