const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Cart = require("../database/models/Cart");
const Product = require("../database/models/Product");

const cartRepository = require('./repository')

// Add Item to Cart
exports.addItemToCart = asyncMiddleware(async(req, res, next) => {
    const {
        productId
    } = req.body;
    const quantity = Number.parseInt(req.body.quantity);

    try {
        let cart = await cartRepository.cart();

        const productDetails = await Product
            .findById(productId)
            .populate("category_detail");
        if (!productDetails) {
            return next(new ErrorResponse(404, "Product is not found"))
        }

        //--If cart exists ----
        if (cart) {
            //---- Check if index exists ----
            const indexFound = cart.items.findIndex(item => item.productId.id == productId);
            console.log(indexFound)
                //------This removes an item from the the cart if the quantity is set to zero,
                // We can use this method to remove an item from the list  -------
            if (indexFound !== -1 && quantity <= 0) {
                cart.items.splice(indexFound, 1);
                console.log(cart.items.splice(indexFound, 1))
                if (cart.items.length == 0) {
                    cart.subTotal = 0;
                } else {
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
                console.log("1")
            }
            //----------Check if product exist, just add the previous quantity with 
            //the new quantity and update the total price-------
            else if (indexFound !== -1) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
                cart.items[indexFound].price = productDetails.price
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----Check if quantity is greater than 0 then add item to items array ----
            else if (quantity > 0) {
                cart.items.push({
                    productId: productId,
                    quantity: quantity,
                    price: productDetails.price,
                    total: parseInt(productDetails.price * quantity)
                })
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----If quantity of price is 0 throw the error -------
            else {
                return next(new ErrorResponse(400, "Invalid request"));
            }
            let data = await cart.save();
            res.status(200).json(new SuccessResponse(200, data));
        }
        //------------ This creates a new cart and then adds the item to the cart that has been created------------
        else {
            const cartData = {
                items: [{
                    productId: productId,
                    quantity: quantity,
                    total: parseInt(productDetails.price * quantity),
                    price: productDetails.price
                }],
                subTotal: parseInt(productDetails.price * quantity)
            }
            cart = await cartRepository.addItem(cartData)
                // let data = await cart.save();
            res.status(200).json(new SuccessResponse(200, cart));
        }
    } catch (err) {
        return next(new ErrorResponse(400, err));
    }
});

// Get Cart
exports.getCart = asyncMiddleware(async(req, res, next) => {
    try {
        let cart = await cartRepository.cart()
        if (!cart) {
            return next(new ErrorResponse(400, "Cart not found"))
        }
        res.status(200).json(new SuccessResponse(200, cart));
    } catch (err) {
        console.log(err);
        return next(new ErrorResponse(400, "Something went wrong"));
    }
});

// Empty Cart
exports.emptyCart = asyncMiddleware(async(req, res, next) => {
    try {
        let cart = await cartRepository.cart();
        cart.items = [];
        cart.subTotal = 0
        let data = await cart.save();
        res.status(200).json(new SuccessResponse(200, "Cart has been emptied"));
    } catch (err) {
        console.log(err)
        return next(new ErrorResponse(400, "Something went wrong"));
    }
});