const express = require("express");
const User = require("../database/models/User");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Token = require("../database/models/Token");
const MailService = require("../utility/mail");

// ResetPassword
exports.resetPassword = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse(404, "User is not found"));
  }

  const token = crypto.randomBytes(30).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const newToken = await Token.findOneAndUpdate(
    { email },
    {
      email,
      token: hashedToken,
      expired: Date.now() + 1000 * 60 * process.env.RESETTOKEN_EXPIRED,
      userId: user._id,
    },
    { upsert: true, new: true }
  );

  await MailService.sendMail(
    `Best Seller VN <${process.env.USER_MAIL}>`,
    email,
    "Reset Password",
    `<a href='http://localhost:3000/api/v1/user/resetpassword/${token}'>http://localhost:3000/api/v1/user/resetpassword/${token}</a>`
  );

  res
    .status(200)
    .json(new SuccessResponse(200, `Please check your email - ${email}`));
});

// UpdatePassword
exports.updatePassword = asyncMiddleware(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //check token  in db
  const dbToken = await Token.findOne({
    token: hashedToken,
    expired: { $gt: Date.now() },
  });
  if (!dbToken) {
    return next(new ErrorResponse(400, "Invalid Token"));
  }

  const user = await User.findById(dbToken.userId);
  if (!user) {
    return next(new ErrorResponse(404, "User is not found"));
  }
  user.password = password;
  await user.save();

  res.status(200).json(new SuccessResponse(200, "Your password is updated"));
});
