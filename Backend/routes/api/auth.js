const express = require('express');
const router = express.Router();

const { baseAuth } = require('../../middleware/baseAuth');
const jwtAuth = require('../../middleware/jwtAuth');
const authController = require('../../controllers/authController');

router.post("/register", baseAuth, authController.register);

router.post("/register/verify", baseAuth, authController.verify);

router.post("/forgotPassword", baseAuth, authController.forgotPassword);

router.post("/forgotPassword/verify", baseAuth, authController.forgotPasswordVerify);

router.post("/login", baseAuth, authController.login);

router.patch("/update", jwtAuth, authController.updatePasswordUser);


module.exports = router;