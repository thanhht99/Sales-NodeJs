const ErrorResponse = require("../model/ErrorResponse");

// rest operator
exports.authorize = (...roles) => (req, res, next) => {
    // khi ddos roles là 1 array
    if (!req.user) {
        return next(new ErrorResponse(401, "Unauthorization"))
    }
    if (!roles.includes(req.user.role)) {
        return next(new ErrorResponse(403, "Don't per"));
    }
    next();
};