const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const { authorize } = require("../../middleware/authorize");
const jwtAuth = require("../../middleware/jwtAuth");
const mongoUpload = require("../../middleware/mongoUpload");

router.get("/test", jwtAuth, authorize("admin"), (req, res) => {
  res.status(200).json({ success: true });
});

router.post(
  "/add",
  jwtAuth,
  mongoUpload.single("image"),
  authorize("admin", "saler"),
  productController.createNewProduct
);

router.get("/all", jwtAuth, productController.getAllProducts);

router.get(
  "/:productSku",
  jwtAuth,
  authorize("admin", "saler"),
  productController.getProductBySku
);

router.patch(
  "/update/:productSku",
  jwtAuth,
  authorize("admin", "saler"),
  productController.updateProduct
);

module.exports = router;
