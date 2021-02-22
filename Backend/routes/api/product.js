const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const { authorize } = require('../../middleware/authorize');
const jwtAuth = require('../../middleware/jwtAuth');
const mongoUpload = require('../../middleware/mongoUpload');

router.get('/test', jwtAuth, authorize("admin"), (req, res) => {
    res.status(200).json({ success: true });
})



router
    .route('/')
    .get(jwtAuth, authorize("admin"), productController.getAllProducts)
    .post(mongoUpload.single("image"), productController.createNewProduct);


router.delete('/:productId', jwtAuth, authorize("admin"), productController.deleteProductById)

router.get('/:productId', productController.getProductById)
module.exports = router;