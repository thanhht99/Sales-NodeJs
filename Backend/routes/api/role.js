const express = require('express');
const roleController = require('../../controllers/roleController');
const Role = require('../../database/models/Role');
const asyncMiddleware = require('../../middleware/asyncMiddleware');
const { authorize } = require('../../middleware/authorize');
const jwtAuth = require('../../middleware/jwtAuth');
const ErrorResponse = require('../../model/ErrorResponse');
const SuccessResponse = require('../../model/SuccessResponse');
const router = express.Router();

router.get('/test', jwtAuth, authorize("admin"), (req, res) => {
    res.status(200).json({ success: true });
})


router.get("/all", roleController.getAllRoles);

router.post("/add", roleController.createNewRole);

router.patch("/update/:id", roleController.updateRole);

router.delete("/delete/:id", roleController.deleteRole);

module.exports = router;