const express = require('express');
const ErrorResponse = require('../../model/ErrorResponse');
const SuccessResponse = require('../../model/SuccessResponse');
const asyncMiddleware = require('../../middleware/asyncMiddleware');
const router = express.Router();
const jwtAuth = require('../../middleware/jwtAuth');
const { authorize } = require('../../middleware/authorize');
const cartController = require('../../controllers/cartController');

router.get('/test', jwtAuth, authorize("admin"), (req, res) => {
    res.status(200).json({ success: true });
})

router.post("/add", jwtAuth, cartController.addItemToCart);

router.post("/sub", jwtAuth, cartController.subItemFromCart);

router.get("/", jwtAuth, cartController.getCart);

router.delete("/emptyCart",jwtAuth, cartController.emptyCart);

router.post("/remove", jwtAuth, cartController.removeItemFromCart);

module.exports = router;