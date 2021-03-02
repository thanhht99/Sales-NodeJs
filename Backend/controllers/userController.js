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

  //   console.log(token);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const newToken = new Token({
    userId: user._id,
    email,
    token: hashedToken,
    expired: Date.now() + 1000 * 60,
  });

  await newToken.save();
  
  const info = await MailService.sendMail(
    `Best Seller VN <${process.env.USER_MAIL}>`,
    email,
    "Reset Password",
    "reset password token",
    `<a href='http://localhost:3000/api/v1/user/resetpassword/${token}'>http://localhost:3000/api/v1/user/resetpassword/${token}</a>`
  );

  res
    .status(200)
    .json(new SuccessResponse(200, `Please check your email - ${email}`));

  console.log("HashedToken", hashedToken);
  console.log(info.messageId);
});
