const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Cart = require("../database/models/Cart");
const Product = require("../database/models/Product");
const Order = require("../database/models/Order");
const Bill = require("../database/models/Bill");

// All Order
exports.allOrder = asyncMiddleware(async (req, res, next) => {
  const userEmail = req.user.email;
  const order = await Order.find({ userEmail }).select(
    "-updatedAt -createdAt -__v"
  );
  // console.log(!order.length);
  if (!order.length) {
    return next(new ErrorResponse(404, "No order"));
  }
  res.status(200).json(new SuccessResponse(200, order));
});

// Find Order By Id
exports.findOrderById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const userEmail = req.user.email;
  if (!id.trim()) {
    return next(new ErrorResponse(400, "Id is empty"));
  }
  const order = await Order.findOne({ _id: id, userEmail }).select(
    "-updatedAt -createdAt -__v"
  );
  // console.log(order);
  if (!order) {
    return next(new ErrorResponse(404, "No order"));
  }
  res.status(200).json(new SuccessResponse(200, order));
});

// Change Order Status
exports.changeOrderStatus = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus } = req.body;
  const userEmail = req.user.email;
  if (!id.trim()) {
    return next(new ErrorResponse(400, "Id or Status is empty"));
  }
  const order = await Order.findOne({ _id: id, userEmail }).select(
    "-updatedAt -createdAt -__v"
  );
  // console.log(order);
  if (!order) {
    return next(new ErrorResponse(404, "No order"));
  }
  const updatedOrderStatus = await Order.findOneAndUpdate(
    { _id: id },
    { orderStatus },
    { new: true }
  );
  if (updatedOrderStatus) {
    res.status(200).json(new SuccessResponse(200, updatedOrderStatus));
  }
});

// Export Bill
exports.exportBill = asyncMiddleware(async (req, res, next) => {
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
  if (order.isBill) {
    return next(new ErrorResponse(403, "Bill already"));
  }
  const newBill = new Bill({ userEmail });
  newBill.orderId = order._id;
  newBill.phone = order.phone;
  newBill.products = order.products;
  newBill.deliveryAddress = order.deliveryAddress;
  newBill.orderDate = order.orderDate;
  newBill.intendedArrivalDate = order.intendedArrivalDate;
  newBill.payments = order.payments;
  newBill.provisional = order.provisional;
  newBill.transportFee = order.transportFee;
  newBill.billIssuer = userEmail;
  newBill.totalProduct = order.totalProduct;
  newBill.subTotal = order.subTotal;

  const res_bill = await newBill.save();

  if (res_bill) {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id },
      { isBill: true },
      { new: true }
    );
    console.log(updatedOrder);
    res.status(201).json(new SuccessResponse(201, res_bill));
  }
});
