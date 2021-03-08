const express = require("express");
const ErrorResponse = require("../../model/ErrorResponse");
const SuccessResponse = require("../../model/SuccessResponse");
const asyncMiddleware = require("../../middleware/asyncMiddleware");
const router = express.Router();
const jwtAuth = require("../../middleware/jwtAuth");
const { authorize } = require("../../middleware/authorize");
const orderController = require("../../controllers/orderController");

router.get("/test", jwtAuth, authorize("admin"), (req, res) => {
  res.status(200).json({ success: true });
});

router.get("/allOrder", jwtAuth, orderController.allOrder);

router.post("/findOrderById/:id", jwtAuth, orderController.findOrderById);

router.post(
  "/changeOrderStatus/:id",
  jwtAuth,
  authorize("admin", "saler"),
  orderController.changeOrderStatus
);

module.exports = router;
