const express = require('express');
const Category = require('../../database/models/Category');
const ErrorResponse = require('../../model/ErrorResponse');
const SuccessResponse = require('../../model/SuccessResponse');
const asyncMiddleware = require('../../middleware/asyncMiddleware');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');
const jwtAuth = require('../../middleware/jwtAuth');
const { authorize } = require('../../middleware/authorize');

router.get('/test', jwtAuth, authorize("admin"), (req, res) => {
    res.status(200).json({ success: true });
})

router.get("/all", jwtAuth, authorize("admin"), categoryController.getAllCategories);

router.post("/add", jwtAuth, authorize("admin"), categoryController.createNewCategory);

router.patch("/update/:id", jwtAuth, authorize("admin"), categoryController.updateCategory);

router.delete("/delete/:id", jwtAuth, authorize("admin"), categoryController.deleteCategory);

module.exports = router;