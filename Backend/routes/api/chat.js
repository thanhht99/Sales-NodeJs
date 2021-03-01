const express = require('express');
const chatController = require('../../controllers/chatController');
const asyncMiddleware = require('../../middleware/asyncMiddleware');
const { authorize } = require('../../middleware/authorize');
const jwtAuth = require('../../middleware/jwtAuth');
const ErrorResponse = require('../../model/ErrorResponse');
const SuccessResponse = require('../../model/SuccessResponse');
const router = express.Router();

router.get('/test', jwtAuth, (req, res) => {
    res.status(200).json({ success: true });
})

router.post("/send", jwtAuth, chatController.send);