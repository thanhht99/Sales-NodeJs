const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const ErrorResponse = require('../model/ErrorResponse');


const jwtAuth = async(req, res, next) => {
    if (!req.headers.authorization) {
        return next(new ErrorResponse(401, "You are not authorized"))
    }
    const token = req.headers.authorization.split(' ')[1];
    // console.log(token);
    if (!token) {
        return next(new ErrorResponse(401, "Unauthorized"))
    }
    // kiem tra token
    try {
        const payload = jwt.verify(token, process.env.SECRETKEY);
        // console.log(payload)
        const user = await User.findOne({ email: payload.email });
        if (user) {
            // tạo 1 property trong req
            req.user = payload;
            process.env.emailSender = user.email;
            next();
        } else {
            return next(new ErrorResponse(401, "Unauthorized"))
        }
    } catch (error) {
        return next(new ErrorResponse(401, "Unauthorized"))
    }
}

module.exports = jwtAuth;