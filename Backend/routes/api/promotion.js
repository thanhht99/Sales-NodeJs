const express = require("express");
const ErrorResponse = require("../../model/ErrorResponse");
const SuccessResponse = require("../../model/SuccessResponse");
const asyncMiddleware = require("../../middleware/asyncMiddleware");
const router = express.Router();
const jwtAuth = require("../../middleware/jwtAuth");
const { authorize } = require("../../middleware/authorize");
const promotionController = require("../../controllers/promotionController");

router.get("/test", jwtAuth, authorize("admin"), (req, res) => {
    res.status(200).json({ success: true });
});

router.post("/add", jwtAuth, authorize("admin"), promotionController.createNewPromotion);

router.get("/all", jwtAuth, authorize("admin"), promotionController.getAllPromotions);

router.patch("/update/:productId", jwtAuth, authorize("admin"), promotionController.updatePromotion);

// router.delete("/delete/:id", jwtAuth, authorize("admin"), promotionController.deleteRole);


module.exports = router;