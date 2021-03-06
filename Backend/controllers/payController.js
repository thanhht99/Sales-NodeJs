const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Cart = require("../database/models/Cart");
const Product = require("../database/models/Product");
const Order = require("../database/models/Order");

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// Pay
exports.pay = asyncMiddleware(async (req, res, next) => {
  const { deliveryAddress, payments, phone } = req.body;
  const userEmail = req.user.email;
  const cart = await Cart.findOne({ userEmail });
  const newOrder = new Order({ userEmail, deliveryAddress, payments, phone });

  if (cart) {
    newOrder.totalProduct = cart.totalProduct;
    newOrder.provisional = Number.parseInt(cart.subTotal);
    newOrder.products = cart.products;
    const date = new Date();
    newOrder.orderDate = date;
    newOrder.intendedArrivalDate = date.addDays(5);
    newOrder.transportFee = 34000;
    newOrder.subTotal =
      Number.parseInt(newOrder.transportFee) +
      Number.parseInt(newOrder.provisional);
    const link = process.env.linkPayment;

    if (payments === "Momo") {
      if (newOrder.totalProduct > 0) {
        //   console.log(newOrder);
        const res_order = await newOrder.save();
        if (res_order) {
          for (let i = 0; i < newOrder.products.length; i++) {
            const product = await Product.findOne({
              _id: newOrder.products[i].productId,
            });
            if (product) {
              product.quantity =
                product.quantity - newOrder.products[i].quantity;
              await product.save();
            }
          }
          cart.products = [];
          cart.subTotal = 0;
          cart.totalProduct = 0;
          const data = await cart.save();
          res
            .status(201)
            .json(
              new SuccessResponse(
                201,
                `Order successfully. Please check your email - ${link}`
              )
            );
        }
      } else {
        return next(new ErrorResponse(400, "Cart is empty"));
      }
    } else {
      return next(
        new ErrorResponse(400, "Currently only supports Momo payments")
      );
    }
  } else {
    return next(new ErrorResponse(400, "Cart is empty"));
  }
});
