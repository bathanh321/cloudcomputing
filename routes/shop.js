const express = require('express');
const router = express.Router();
const FigureModel = require('../models/FigureModels');
const DollModel = require('../models/DollModels');
const CartModel = require('../models/CartModels');

router.get('/', async (req, res) => {
    const figures = await FigureModel.find();
    const dolls = await DollModel.find();
    const user = req.session.users;
    const products = [...figures, ...dolls];

    res.render('shop/shop', { products: products, user: user });
});

router.post('/search', async (req, res) => {
    const keyword = req.body.keyword;
    const figureResults = await FigureModel.find({ model: new RegExp(keyword, "i") });
    const dollResults = await DollModel.find({ model: new RegExp(keyword, "i") });
    const user = req.session.users;
    res.render('shop/search', { figureResults: figureResults, dollResults: dollResults, user: user });
});

router.get('/detail/:id', async (req, res) => {
    var id = req.params.id;
    var figures = await FigureModel.findById(id);
    var dolls = await DollModel.findById(id);
    const user = req.session.users;
    if (figures) {
        res.render('shop/detail', { product: figures, user: user });
    } else if (dolls) {
        res.render('shop/detail', { product: dolls, user: user });
    }
})
router.post('/cart', async (req, res) => {
    const data = req.body;
    const id = data.product_id;
    const user = req.session.users;
    const product = await FigureModel.findById(id) || await DollModel.findById(id);
    const price = data.price;
    const quantity = parseInt(data.quantity);
    const total = price * quantity;


    res.render('shop/cart', { product: product, quantity: quantity, price: price, total: total, user: user })
});
router.post('/checkout', async (req, res) => {
    const productId = req.body.product_id;
    const quantity = parseInt(req.body.quantity);
    const product = await FigureModel.findById(productId) || await DollModel.findById(productId);
    const user = req.session.users;
    if (product) {
        product.quantity -= quantity;
        await product.save();
        const newCartItem = new CartModel({
            userId: user._id,
            product_id: productId,
            quantity: quantity,
            price: product.price,
            total: product.price * quantity,
        });
        await newCartItem.save();
    }
    res.render('shop/checkout');
});
module.exports = router;
