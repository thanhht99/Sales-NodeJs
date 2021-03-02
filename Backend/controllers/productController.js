const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Product = require("../database/models/Product");

// Add Product
exports.createNewProduct = asyncMiddleware(async (req, res, next) => {
  const {
    name,
    price,
    quantity,
    description,
    category,
    sku,
    origin,
  } = req.body;
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
  res.status(201).json(new SuccessResponse(201, product));
});

// All Product
exports.getAllProducts = asyncMiddleware(async (req, res, next) => {
  const products = await Product.find().select("-updatedAt -createdAt -__v");
  res.status(200).json(new SuccessResponse(200, products));
});

// Find Product By SKU
exports.getProductBySku = asyncMiddleware(async (req, res, next) => {
  const { productSku } = req.params;
  const doc = await Product.findOne({
    sku: productSku,
  });
  if (!doc) {
    return next(new ErrorResponse(404, "Product is not found"));
  }
  res.status(200).json(new SuccessResponse(200, doc));
});

// Update Product
exports.updateProduct = asyncMiddleware(async (req, res, next) => {
  const { productSku } = req.params;
  const doc = await Product.findOne({
    sku: productSku,
  });
  if (!doc) {
    return next(new ErrorResponse(404, "Product is not found"));
  }
  
  const updatedProduct = await Product.findOneAndUpdate(
    { sku: productSku },
    req.body,
    { new: true }
  );
  if (!updatedProduct) {
    return next(new ErrorResponse(400, "Can not updated"));
  }
  res.status(200).json(new SuccessResponse(200, updatedProduct));
});