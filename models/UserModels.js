const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String, 
    confirmPassword: String,
    avatar: String,

})
const UserModel = mongoose.model('users', UserSchema, 'users')
module.exports = UserModel