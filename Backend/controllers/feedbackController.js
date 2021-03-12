const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Product = require("../database/models/Product");
const Order = require("../database/models/Order");
const Bill = require("../database/models/Bill");
const Feedback = require("../database/models/Feedback");

// Feedback
exports.feedback = asyncMiddleware(async(req, res, next) => {
    const { contentFeedback } = req.body;
    const { id } = req.params;
    const userEmail = req.user.email;
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const order = await Order.findOne({ _id: id }).select(
        "-updatedAt -createdAt -__v"
    );
    // console.log(order);
    if (!order) {
        return next(new ErrorResponse(404, "No order"));
    }
    if (order.isFeedback) {
        return next(new ErrorResponse(403, "Feedback already"));
    }
    if (order.orderStatus !== "Successful delivery") {
        return next(new ErrorResponse(403, "The order has not been delivered"));
    }

    const newFeedback = new Feedback({ orderId: id, userEmail, contentFeedback });
    newFeedback.phone = order.phone;

    const res_Feedback = await newFeedback.save();

    if (res_Feedback) {
        const updatedOrder = await Order.findOneAndUpdate({ _id: order._id }, { isFeedback: true }, { new: true });
        // console.log(updatedOrder);
        res.status(201).json(new SuccessResponse(201, res_Feedback));
    }
});