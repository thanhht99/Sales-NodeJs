const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Product = require("../database/models/Product");
const collect = require('collect.js');

// Add Product
exports.createNewProduct = asyncMiddleware(async(req, res, next) => {
    const { name, price, quantity, description, category, sku, origin } = req.body
    const newProduct = new Product({
        name,
        price,
        quantity,
        description,
        category,
        origin,
        sku,
        image: req.file.filename,
    });
    const product = await newProduct.save();
    res.status(201).json(new SuccessResponse(201, product))
})

// All Product
exports.getAllProducts = asyncMiddleware(async(req, res, next) => {
    const products = await Product.find().select('-updatedAt -createdAt -__v');
    res.status(200).json(new SuccessResponse(200, products));
});

// Find Product By SKU
exports.getProductBySku = asyncMiddleware(async(req, res, next) => {
    const { productSku } = req.params;
    const doc = await Product
        .find({
            sku: productSku
        })
        .populate("category_detail");
    const total = collect(doc).count();
    if (total === 0) {
        return next(new ErrorResponse(404, "Product is not found"))
    }
    res.status(200).json(new SuccessResponse(200, doc));
});

// Update Product
exports.updateProduct = asyncMiddleware(async(req, res, next) => {
    const { productSku } = req.params;
    const doc = await Product
        .find({
            sku: productSku
        });
    const total = collect(doc).count();
    if (total === 0) {
        return next(new ErrorResponse(404, "Product is not found"))
    }
    const updatedProduct = await Product.findOneAndUpdate({ sku: productSku }, req.body, { new: true });
    if (!updatedProduct) {
        return next(new ErrorResponse(400, 'Can not updated'))
    }
    res.status(200).json(new SuccessResponse(200, updatedProduct))
});

// Update Active False Product
exports.updateActiveFalseProduct = asyncMiddleware(async(req, res, next) => {
    const { productSku } = req.params;
    const doc = await Product
        .find({
            sku: productSku
        });
    const total = collect(doc).count();
    if (total === 0) {
        return next(new ErrorResponse(404, "Product is not found"))
    }
    const updatedProduct = await Product.findOneAndUpdate({ sku: productSku }, { isActive: false }, { new: true });
    if (!updatedProduct) {
        return next(new ErrorResponse(400, 'Can not updated'))
    }
    res.status(200).json(new SuccessResponse(200, updatedProduct))
});

// Update Active True Product
exports.updateActiveTrueProduct = asyncMiddleware(async(req, res, next) => {
    const { productSku } = req.params;
    const doc = await Product
        .find({
            sku: productSku
        });
    const total = collect(doc).count();
    if (total === 0) {
        return next(new ErrorResponse(404, "Product is not found"))
    }
    const updatedProduct = await Product.findOneAndUpdate({ sku: productSku }, { isActive: true }, { new: true });
    if (!updatedProduct) {
        return next(new ErrorResponse(400, 'Can not updated'))
    }
    res.status(200).json(new SuccessResponse(200, updatedProduct))
});