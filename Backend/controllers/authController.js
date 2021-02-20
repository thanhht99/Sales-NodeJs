const express = require('express');
const User = require("../database/models/User");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");

const {
    sendEmail,
    sendCodeForgotPassword,
    sendPassword
} = require('../utility/mail');

// Register
exports.register = asyncMiddleware(async(req, res, next) => {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    var verify = Math.floor(Math.random() * 1000000);
    newUser.verifyCode = verify;
    const res_user = await newUser.save();
    if (res_user) {
        await sendEmail(newUser, res, next);
    }
    res.status(201).json(new SuccessResponse(201, res_user));

});

// Verify
exports.verify = asyncMiddleware(async(req, res, next) => {
    const { email, verifyCode } = req.body;
    const isExistEmail = await User.findOne({ email });
    if (isExistEmail) {
        if (isExistEmail.verifyCode === verifyCode) {
            if (!isExistEmail.isActive) {
                const updatedActive = await User.findOneAndUpdate({ email }, { isActive: true }, { new: true });
                if (!updatedActive) {
                    return next(new ErrorResponse(403, "Failure Authentication"))
                }
                res.status(200).json(new SuccessResponse(200, updatedActive))
            }
            return next(new ErrorResponse(403, 'Already Verified'))
        } else {
            return next(new ErrorResponse(403, "Failure Authentication"))
        }
    } else {
        return next(new ErrorResponse(404, "Email not found"))
    }
});

// Login
exports.login = asyncMiddleware(async(req, res, next) => {
    const { email, password } = req.body;
    const isExistEmail = await User.findOne({ email });
    if (isExistEmail) {
        const isMatchPassword = await User.comparePassword(password, isExistEmail.password);
        if (isMatchPassword) {
            // generate jwt
            // payload la nhung thu muon luu trong token
            const token = jwt.sign({
                    name: isExistEmail.name,
                    email: isExistEmail.email,
                    role: isExistEmail.role
                },
                process.env.SECRETKEY,
            )
            if (isExistEmail.isActive) {
                return res.status(200).json(new SuccessResponse(200, token))
            } else {
                return next(new ErrorResponse(403, "Account locked"))
            }
        } else {
            return next(new ErrorResponse(400, "Password is not match"))
        }
    } else {
        return next(new ErrorResponse(404, "Email not found"))
    }
});

// Update
exports.updatePasswordUser = asyncMiddleware(async(req, res, next) => {
    const { email, password } = req.body;
    const isExistEmail = await User.findOne({ email });
    if (isExistEmail) {
        if (isExistEmail.isActive) {
            isExistEmail.password = password;
            const updatedPassword = await isExistEmail.save();
            if (!updatedPassword) {
                return next(new ErrorResponse(400, 'Updated Password Failure'))
            }
            res.status(200).json(new SuccessResponse(200, updatedPassword));
        }
        return next(new ErrorResponse(403, "Account locked"))
    } else {
        return next(new ErrorResponse(404, "Email not found"))
    }
});

// Forgot password
exports.forgotPassword = asyncMiddleware(async(req, res, next) => {
    const { email } = req.body;
    const isExistEmail = await User.findOne({ email });
    if (isExistEmail) {
        if (isExistEmail.isActive) {
            var verify = Math.floor(Math.random() * 1000000);
            const updatedVerifyCode = await User.findOneAndUpdate({ email }, { verifyCode: verify }, { new: true });
            if (!updatedVerifyCode) {
                return next(new ErrorResponse(400, 'Updated Verify Code Failure'))
            }
            await sendCodeForgotPassword(updatedVerifyCode, res, next);
            res.status(200).json(new SuccessResponse(200, updatedVerifyCode));
        }
        return next(new ErrorResponse(403, "Account locked"))

    } else {
        return next(new ErrorResponse(404, "Email not found"))
    }
});

// Forgot password Verify
exports.forgotPasswordVerify = asyncMiddleware(async(req, res, next) => {
    const { email, verifyCode } = req.body;
    const isExistEmail = await User.findOne({ email });
    if (isExistEmail) {
        if (isExistEmail.verifyCode === verifyCode) {
            if (isExistEmail.isActive) {
                const passwordRandom = crypto.randomBytes(5).toString('hex');
                isExistEmail.password = passwordRandom;
                console.log(isExistEmail);
                await sendPassword(isExistEmail, res, next);
                const updatedPassword = await isExistEmail.save();
                if (!updatedPassword) {
                    return next(new ErrorResponse(400, 'Updated Password Failure'))
                }
                res.status(200).json(new SuccessResponse(200, updatedPassword));
            }
            return next(new ErrorResponse(403, "Account locked"))
        } else {
            return next(new ErrorResponse(403, "Failure Authentication"))
        }
    } else {
        return next(new ErrorResponse(404, "Email not found"))
    }
});