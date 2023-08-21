const mongoose = require('mongoose')
var CartSchema = mongoose.Schema({
  userId: String,
    product_id: String,
    quantity: Number,
    price: Number,
    total: Number,
  });
  
  const CartModel = mongoose.model('cart', CartSchema, 'cart');
  module.exports = CartModel