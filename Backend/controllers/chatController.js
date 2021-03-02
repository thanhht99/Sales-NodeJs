const express = require('express');
const Chat = require("../database/models/Chat");
const User = require("../database/models/User");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");

// Send
exports.send = asyncMiddleware(async(req, res, next) => {
    const { emailReceiver, messages } = req.body;
    const emailSender = process.env.emailSender;

    const isExistEmail = await User.findOne({ email:emailReceiver });
    if (isExistEmail) {
        if (isExistEmail.isActive) {
            const newChat = new Chat({ emailReceiver, messages, emailSender });
            const res_newChat = await newChat.save();
            return res.status(201).json(new SuccessResponse(201, res_newChat))    
        }
        return next(new ErrorResponse(403, 'Already Verified'))
    } else {
        return next(new ErrorResponse(404, "Email not found"))
    }
});

// Conversation
exports.conversation = asyncMiddleware(async(req, res, next) => {

    const { emailReceiver } = req.body;
    const emailSender = process.env.emailSender;

    const isExistEmail = await User.findOne({ email:emailReceiver });
    if (isExistEmail) {
        if (isExistEmail.isActive) {
            const newChat = new Chat({ emailReceiver, messages, emailSender });
            const res_newChat = await newChat.save();
            return res.status(201).json(new SuccessResponse(201, res_newChat))    
        }
        return next(new ErrorResponse(403, 'Already Verified'))
    } else {
        return next(new ErrorResponse(404, "Email not found"))
    }
});