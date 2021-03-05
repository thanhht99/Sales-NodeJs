const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Cart = require("../database/models/Cart");
const Product = require("../database/models/Product");

// Add Item to Cart
exports.addItemToCart = asyncMiddleware(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const checkQuantity = Number.parseInt(quantity);
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });
  if (checkQuantity <= 0 || checkQuantity !== quantity) {
    return next(new ErrorResponse(400, "Invalid quantity"));
  }
  const cart = await Cart.findOne({ userEmail: req.user.email });
  if (cart) {
    const indexFound = cart.products.findIndex(
      (item) => item.productId == productId
    );
    // console.log(indexFound);
    if (!product) {
      return next(new ErrorResponse(404, "Product is not found"));
    } else if (
      indexFound !== -1 &&
      cart.products[indexFound].quantity + quantity <= product.quantity
    ) {
      cart.products[indexFound].quantity =
        cart.products[indexFound].quantity + quantity;
      cart.products[indexFound].total =
        cart.products[indexFound].quantity * product.price;
      cart.products[indexFound].price = product.price;
    } else if (
      quantity > 0 &&
      quantity <= product.quantity &&
      indexFound === -1
    ) {
      cart.products.push({
        productId: productId,
        quantity: quantity,
        total: parseInt(product.price * quantity),
        price: product.price,
      });
    } else {
      return next(new ErrorResponse(400, "Invalid request"));
    }
    cart.subTotal = cart.products
      .map((item) => item.total)
      .reduce((acc, next) => acc + next);
    cart.totalProduct = cart.products
      .map((item) => item.quantity)
      .reduce((acc, next) => acc + next);
    // console.log(cart)
    const data = await cart.save();
    res.status(200).json(new SuccessResponse(200, data));
  } else {
    if (!product) {
      return next(new ErrorResponse(404, "Product is not found"));
    }
    if (product.quantity < quantity) {
      return next(new ErrorResponse(400, "Quantity of products is not enough"));
    }
    const products = {
      productId: productId,
      quantity: quantity,
      total: parseInt(product.price * quantity),
      price: product.price,
    };
    const userEmail = req.user.email;
    const totalProduct = quantity;
    const subTotal = parseInt(product.price * quantity);
    const newCart = new Cart({
      userEmail,
      products,
      totalProduct,
      subTotal,
    });
    const res_cart = await newCart.save();
    return res.status(200).json(new SuccessResponse(200, res_cart));
  }
});

// Get Cart
exports.getCart = asyncMiddleware(async (req, res, next) => {
  // console.log(req.user.email)
  try {
    const cart = await Cart.findOne({ userEmail: req.user.email });
    if (!cart) {
      return next(new ErrorResponse(400, "Cart not found"));
    }
    res.status(200).json(new SuccessResponse(200, cart));
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(400, "Something went wrong"));
  }
});

// Empty Cart
exports.emptyCart = asyncMiddleware(async (req, res, next) => {
  // console.log(req.user.email)
  try {
    const cart = await Cart.findOne({ userEmail: req.user.email });
    if (!cart) {
      return next(new ErrorResponse(400, "Cart not found"));
    }
    cart.products = [];
    cart.subTotal = 0;
    cart.totalProduct = 0;
    let data = await cart.save();
    res.status(200).json(new SuccessResponse(200, "Cart has been emptied"));
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(400, "Something went wrong"));
  }
});

// Subtract Product Quantity from Cart
exports.subItemFromCart = asyncMiddleware(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const checkQuantity = Number.parseInt(quantity);
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });
  if (checkQuantity <= 0 || checkQuantity !== quantity) {
    return next(new ErrorResponse(400, "Invalid quantity"));
  }
  const cart = await Cart.findOne({ userEmail: req.user.email });
  try {
    if (!product) {
      return next(new ErrorResponse(404, "Product is not found"));
    } else if (cart) {
      const indexFound = cart.products.findIndex(
        (item) => item.productId == productId
      );
      if (quantity > cart.products[indexFound].quantity || quantity <= 0) {
        return next(new ErrorResponse(400, "Quantity illegal"));
      } else if (cart.products[indexFound].quantity - quantity < 1) {
        return next(
          new ErrorResponse(400, "Quantity product can not be less then 1.")
        );
      } else if (indexFound !== -1) {
        cart.products[indexFound].quantity =
          cart.products[indexFound].quantity - quantity;
        cart.products[indexFound].total =
          cart.products[indexFound].quantity * product.price;
        cart.products[indexFound].price = product.price;
      } else {
        return next(new ErrorResponse(400, "Invalid request"));
      }
      cart.subTotal = cart.products
        .map((item) => item.total)
        .reduce((acc, next) => acc + next);
      cart.totalProduct = cart.products
        .map((item) => item.quantity)
        .reduce((acc, next) => acc + next);
      const data = await cart.save();
      res.status(200).json(new SuccessResponse(200, data));
    } else {
      return next(new ErrorResponse(400, "Cart is empty"));
    }
  } catch (err) {
    return next(new ErrorResponse(400, "Cart is empty"));
  }
});

// Remove Single Product From Cart
exports.removeItemFromCart = asyncMiddleware(async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });
  const cart = await Cart.findOne({ userEmail: req.user.email });
    if (cart) {
      const indexFound = cart.products.findIndex(
        (item) => item.productId == productId
      );
      // console.log(indexFound)
      if (indexFound === -1) {  
        return next(new ErrorResponse(404, "Product is not found"));
      }
      if (indexFound >= 0) {
        cart.products.splice(indexFound, 1);
        cart.subTotal = cart.products
          .map((item) => item.total)
          .reduce((acc, next) => acc + next);
        cart.totalProduct = cart.products
          .map((item) => item.quantity)
          .reduce((acc, next) => acc + next);
        const dataUpdate = await cart.save();
        res.status(200).json(new SuccessResponse(200, dataUpdate));
      } else {
        return next(new ErrorResponse(400, "Cart is empty"));
      }
    } else {
      return next(new ErrorResponse(400, "Cart is empty"));
    }
});
