const express = require('express');
const router = express.Router();
const passport = require('passport');

const config = require('../config/usersdb');
const User = require('../models/user');
const Order = require('../models/orders');





// Register
router.post('/register', notLogged, (req, res) => {
  let newUser= new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:"Failed to register"});
    }else{
      res.json({success: true, msg:"Registration completed"});
    }
  });
});



// Authenticate
router.post('/authenticate', notLogged, function(req,res,next){
  passport.authenticate('local.login', (err, user, info) => {
    if(err){res.json({success: false, msg:"error"});}
    else if (user == false) {
      res.json({success: false, msg:info.message});
    }else{
      req.login(user, function(err) {
        if (err) return err;
        let myuser ={};
        myuser.first_name = user.first_name;
        myuser.last_name = user.last_name;
        myuser._id = user._id;
        myuser.email = user.email;
        myuser.success = true;
        res.json(myuser);

      });
    }
  })(req,res,next);
});




router.get('/logout', isLogged, (req,res) => {
  req.logout();
  res.json({msg: "logged out"});
});

router.post('/order', isLogged, (req,res) => {
  let newOrder= new Order({
    customer_id: req.body.customer_id,
    date: Date.now(),
    address: req.body.address,
    city: req.body.city,
    zip: req.body.zip,
    telephone: req.body.telephone,
    payment_method: req.body.payment_method,
    name_card: req.body.name_card,
    creditcard_number: req.body.creditcard_number,
    creditcard_type:req.body.creditcard_type,
    expiration:req.body.expiration,
    cvv: req.body.cvv,
    order: req.body.order,
    total_price: req.body.total_price
  });

  Order.addOrder(newOrder, (err, order) => {
    if(err){
      res.json({success: false, msg:"Failed to order"});
    }else{
      res.json({success: true, msg:"Order completed"});
    }
  });
});


router.get('/checkifloggedin', isLogged, (req,res) => {
  res.json({msg:"logged in"});
});

module.exports = router;

 function isLogged(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.json({msg: "not logged in"});
}

 function notLogged(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.json({msg: "already logged in"});
}
