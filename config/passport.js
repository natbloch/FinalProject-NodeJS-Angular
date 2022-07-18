const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

const config = require('./usersdb');

passport.serializeUser((user,done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err,user) => {
    done(err, user);
  });
});

//STRATEGY FOR LOGIN
passport.use('local.login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.getUserByEmail(email, (err, user) => {
    if(err){
      return done(err);
    }
    if(!user){
      return done(null, false, {message:'No user found'});
    }

   User.comparePassword(password, user.password, (err, res) => {
    if(err) throw err;
    if(res == false){
      return done(null, false, {message:'Invalid Password'});
    }
      return done(null, user);
   });
  });
}));
