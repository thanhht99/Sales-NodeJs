const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Product = require("../database/models/Product");
const Order = require("../database/models/Order");
const Bill = require("../database/models/Bill");
const Promotion = require("../database/models/Promotion");

// Add Promotion
exports.createNewPromotion = asyncMiddleware(async(req, res, next) => {
    const { productId, discount } = req.body;
    const product = await Product.findOne({
        _id: productId,
        isActive: true,
    });
    if (!product) {
        return next(new ErrorResponse(404, "Product is not found"));
    }
    const checkPromotion = await Promotion.findOne({
        productId: productId,
    });
    if (checkPromotion) {
        return next(new ErrorResponse(404, "The product has a promotion"));
    }
    const newPromotion = new Promotion({ productId, discount });
    const promotion = await newPromotion.save();
    res.status(201).json(new SuccessResponse(201, promotion))
});

// All Promotions
exports.getAllPromotions = asyncMiddleware(async(req, res, next) => {
    const promotions = await Promotion.find().select('-updatedAt -createdAt -__v');
    if (!promotions.length) {
        return next(new ErrorResponse(404, 'No promotions'));
    }
    res.status(200).json(new SuccessResponse(200, promotions))
});

// Promotion Update
exports.updatePromotion = asyncMiddleware(async(req, res, next) => {
    const { discount } = req.body;
    const { productId } = req.params;
    if (!productId.trim()) {
        return next(new ErrorResponse(400, "Product Id is empty"));
    }
    const checkPromotion = await Promotion.findOne({ productId });
    if (!checkPromotion) {
        return next(new ErrorResponse(404, "The product hasn't promotion"));
    }
    const updatedPromotion = await Promotion.findOneAndUpdate({ productId }, { discount }, { new: true });
    if (!updatedPromotion) {
        return next(new ErrorResponse(400, 'Can not updated'))
    }
    res.status(200).json(new SuccessResponse(200, updatedPromotion))
});