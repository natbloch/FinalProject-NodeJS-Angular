const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/usersdb');

//Client Schema
const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
}

module.exports.getUserByEmail = (email, callback) => {
  const query = {email: email};
  User.findOne(query, callback);
}

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(5, (err, salt) =>{
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}


module.exports.comparePassword = (password, userpass, callback) => {
    bcrypt.compare(password, userpass, callback);
  }
