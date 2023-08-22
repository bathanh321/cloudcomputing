const mongoose = require('mongoose')
var CartSchema = mongoose.Schema({
    userId: String,
    userName: String,
    userAvatar: String,
    product_id: String,
    productImage: String,
    quantity: Number,
    price: Number,
    total: Number,
  });
  
  const CartModel = mongoose.model('cart', CartSchema, 'cart');
  module.exports = CartModel