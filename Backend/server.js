const express = require('express');
require('dotenv').config()


const colors = require('colors');
const app = express();
const PORT = 3000;
const router = express.Router();

const auth = require('./routes/api/auth');
const role = require('./routes/api/role');
const product = require('./routes/api/product');
const category = require('./routes/api/category');
const cart = require('./routes/api/cart');
const chat = require('./routes/api/chat');

const errorMiddleware = require('./middleware/errorMiddleware');

const { ConnectMongo } = require('./database/connectDB');
const { baseAuth } = require('./middleware/baseAuth');


// using MongoDB
ConnectMongo.getConnect();

// middleware parse body 
app.use(express.json());

// routes
app.use('/api/v1/auth', auth);

app.use('/api/v1/role', role);

app.use('/api/v1/product', product);

app.use('/api/v1/category', category);

app.use('/api/v1/cart', cart);

app.use('/api/v1/chat', chat);







app.get("/test", (req, res, next) => {
    res.status(200).json({ success: true });
})

// viet duoi phan route
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`.red)
})