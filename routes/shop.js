const express = require('express');
const router = express.Router();
const FigureModel = require('../models/FigureModels');
const DollModel = require('../models/DollModels');

router.get('/', async (req, res) => {
        const figures = await FigureModel.find();
        const dolls = await DollModel.find();
        const user = req.session.users;
        const products = [...figures, ...dolls];

        res.render('shop/shop', { products : products, user: user });
});

router.get('/detail/:id', async (req, res) => {
        var id = req.params.id;
        var figures = await FigureModel.findById(id);
        var dolls = await DollModel.findById(id);
        if (figures) {
                res.render('shop/detail', { product: figures });
            } else if (dolls) {
                res.render('shop/detail', { product: dolls });
            }
     })
router.post('/cart', async (req, res) => {
        const data = req.body;
        const id = data.product_id;
        const product = await FigureModel.findById(id) || await DollModel.findById(id);
        const price = data.price; 
        const quantity = parseInt(data.quantity); 
        const total = price * quantity;

    
        res.render('shop/cart', { product: product, quantity: quantity, price: price, total: total })
    });
router.post('/checkout', async (req, res) => {
    const productId = req.body.product_id;
    const quantity = parseInt(req.body.quantity);
    const product = await FigureModel.findById(productId) || await DollModel.findById(productId);
    if (product) {
        product.quantity -= quantity;
        await product.save();
    }
        
    res.render('shop/checkout');
});
module.exports = router;
