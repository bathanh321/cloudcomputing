const express = require('express');
const router = express.Router();
const FigureModel = require('../models/FigureModels'); // Import FigureModel
const DollModel = require('../models/DollModels'); // Import DollModel
const UserModel = require('../models/UserModels');

router.get('/', async (req, res) => {
        const figures = await FigureModel.find();
        const dolls = await DollModel.find();
        const users = await UserModel.find();
        const products = [...figures, ...dolls]; // Combine both arrays

        res.render('shop/shop', { products : products, users: users });
});

router.get('/detail/:id', async (req, res) => {
        var id = req.params.id;
        var figures = await FigureModel.findById(id);
        var dolls = await DollModel.findById(id);
        if (figures) {
                res.render('shop/detail', { product: figures }); // Render detail for figure
            } else if (dolls) {
                res.render('shop/detail', { product: dolls }); // Render detail for doll
            }
     })
     router.post('/cart', async (req, res) => {
        const data = req.body;
        const id = data.product_id;
        const product = await FigureModel.findById(id) || await DollModel.findById(id);
        const price = data.price; // Use the product's actual price
        const quantity = parseInt(data.quantity); // Convert quantity to a number
        const total = price * quantity;
        // Logic to add product to cart (store cart data in a session or database)
        res.render('shop/cart', { product: product, quantity: quantity, price: price, total: total });
    });
    
module.exports = router;
