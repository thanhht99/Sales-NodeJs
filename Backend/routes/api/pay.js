const express = require('express');
const ErrorResponse = require('../../model/ErrorResponse');
const SuccessResponse = require('../../model/SuccessResponse');
const asyncMiddleware = require('../../middleware/asyncMiddleware');
const router = express.Router();
const jwtAuth = require('../../middleware/jwtAuth');
const { authorize } = require('../../middleware/authorize');
const payController = require('../../controllers/payController');

router.get('/test', jwtAuth, authorize("admin"), (req, res) => {
    res.status(200).json({ success: true });
})

router.post("/", jwtAuth, payController.pay);

module.exports = router;