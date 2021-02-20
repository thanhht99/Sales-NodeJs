const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const ErrorResponse = require('../model/ErrorResponse');


const jwtAuth = async(req, res, next) => {
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
            next();
        } else {
            return next(new ErrorResponse(401, "Unauthorized"))
        }
    } catch (error) {
        return next(new ErrorResponse(401, "Unauthorized"))
    }
}

module.exports = jwtAuth;