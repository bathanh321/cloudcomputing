var express = require('express');
var router = express.Router();
const multer = require('multer');
const UserModel = require('../models/UserModels');
const CartModel = require('../models/CartModels');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
var upload = multer({ storage: storage });
router.get('/', async (req, res) => {
  var users = await UserModel.find();
  res.send(users);
  res.render('users', { users: users })
})
router.get('/register', async (req, res)=> {
  res.render('users/register')
});
router.post('/register', upload.single('avatar'), async(req, res)=>{
    const users = req.body;
    users.avatar = req.file.filename;
    const password = users.password;
    const confirmPassword = users.confirmPassword;
    if(password === confirmPassword){
      await UserModel.create(users)
        .then(console.log('Register successfully'))
        .catch(err => console.log(err));
    res.render('users/login', {users: users});
    }else{
      res.render("password doesn't match");
    }
})
router.get('/login', async (req, res) => {
  res.render('users/login');
});
router.post('/login', async (req, res) => {
  const data = req.body;
  console.log(data)
  const email = data.email;
  const password = data.password;
  const users = await UserModel.findOne({email: email})
  if(users.password === password){
    req.session.users = users;
    res.redirect('/shop')
  }else{
    res.render('users/login');
  }
});
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.log('Error while logging out:', err);
          return res.redirect('/'); 
      }
      res.redirect('/shop');
  });
});
router.get('/profile/:id', async (req, res)=>{
  const id = req.params.id;
  const user = await UserModel.findById(id);
  const cartItem = await CartModel.find({ userId: id });
    
      res.render('users/profile', {user: user, cartItem: cartItem})

    
})
module.exports = router;
