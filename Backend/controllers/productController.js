const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Product = require("../database/models/Product");

exports.getAllProducts = asyncMiddleware(async(req, res, next) => {
    const products = await Product.find();
    res.status(200).json(new SuccessResponse(200, products));
});


exports.createNewProduct = asyncMiddleware(async(req, res, next) => {
    const { name, price, quantity, description, category, sku } = req.body
    const newProduct = new Product({
        name,
        price,
        quantity,
        description,
        category,
        sku,
        image: req.file.filename,
    });
    const product = await newProduct.save();
    res.status(201).json(new SuccessResponse(201, product))
})

exports.deleteProductById = asyncMiddleware(async(req, res, next) => {
    const { productId } = req.params;
    // tim productId tren database
    const doc = await Product.findByIdAndDelete(productId);
    if (!doc) {
        return next(new ErrorResponse(404, "Product is not found"))
    }
    res.status(200).json(new SuccessResponse(200, `product has id ${productId} was deleted`));
});

exports.getProductById = asyncMiddleware(async(req, res, next) => {
    const { productId } = req.params;
    const doc = await Product
        .findById(productId)
        .populate("category_detail");
    if (!doc) {
        return next(new ErrorResponse(404, "Product is not found"))
    }
    res.status(200).json(new SuccessResponse(200, doc));
});