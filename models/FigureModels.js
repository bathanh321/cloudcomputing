const mongoose = require('mongoose')
var FigureSchema = mongoose.Schema({
    model: String,
    brand: String,
    quantity: Number,
    price: Number,
    date: Date,
    image: String
})
const FigureModel = mongoose.model('figure', FigureSchema, 'figure')
module.exports = FigureModel