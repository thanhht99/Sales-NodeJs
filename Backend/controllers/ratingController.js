const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Product = require("../database/models/Product");
const Order = require("../database/models/Order");
const Bill = require("../database/models/Bill");
const Feedback = require("../database/models/Feedback");
const Rating = require("../database/models/Rating");

// Rating
exports.rating = asyncMiddleware(async(req, res, next) => {
    const { rating } = req.body;
    const { id, productId } = req.params;
    const userEmail = req.user.email;
    if (!id.trim() || !productId.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const order = await Order.findOne({ _id: id }).select(
        "-updatedAt -createdAt -__v"
    );
    // console.log(order);
    if (!order) {
        return next(new ErrorResponse(404, "No order"));
    }
    let indexProduct;
    let flags = false;
    for (let i = 0; i < order.products.length; i++) {
        if (order.products[i].productId.toString() === productId) {
            indexProduct = i;
            flags = true;
        }
    }
    // console.log(indexProduct);

    if (!flags) {
        return next(
            new ErrorResponse(404, "The product is not included in the order")
        );
    }
    if (order.orderStatus !== "Successful delivery") {
        return next(new ErrorResponse(403, "The order has not been delivered"));
    }
    if (order.products[indexProduct].isRating) {
        return next(new ErrorResponse(403, "The product has been rated"));
    }

    const newRating = new Rating({
        orderId: id,
        productId: order.products[indexProduct].productId,
        userEmail,
        rating,
    });
    // console.log(newRating);

    const res_Rating = await newRating.save();

    if (res_Rating) {
        const product = await Product.findOne({ _id: productId }).select(
            "-updatedAt -createdAt -__v"
        );
        const timesRatingProduct = product.timesRating + 1;
        const ratingProduct =
            (parseFloat(product.rating) * product.timesRating + rating) /
            parseFloat(timesRatingProduct);
        console.log(ratingProduct);
        console.log(parseFloat(ratingProduct).toFixed(2));

        const updatedProduct = await Product.findOneAndUpdate({ _id: productId }, {
            rating: parseFloat(ratingProduct).toFixed(2),
            timesRating: timesRatingProduct,
        }, { new: true });
        const updatedOrder = await Order.findOneAndUpdate({ "products.productId": productId }, { $set: { "products.$.isRating": true } }, { new: true });

        res.status(201).json(new SuccessResponse(201, res_Rating));
    }
});