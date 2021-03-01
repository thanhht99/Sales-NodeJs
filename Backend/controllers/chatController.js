const express = require('express');
const Chat = require("../database/models/Chat");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");

// Send
exports.send = asyncMiddleware(async(req, res, next) => {
    const { emailReceiver, messages } = req.body;
    const emailSender = process.env.emailSender;


    console.log(emailReceiver)
    console.log(messages)
    console.log(emailSender);





    // const newRole = new Role({ role_name, role_desc });
    // const role = await newRole.save();
    res.status(201).json(new SuccessResponse(201, "Done"))
});