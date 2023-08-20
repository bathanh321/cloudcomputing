const mongoose = require('mongoose')
var DollSchema = mongoose.Schema({
    model: String,
    brand: String,
    quantity: Number,
    price: Number,
    date: Date,
    image: String
})
const DollModel = mongoose.model('doll', DollSchema, 'doll')
module.exports = DollModel