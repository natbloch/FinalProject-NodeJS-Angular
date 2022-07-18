const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/usersdb');

//Client Schema
const OrderSchema = mongoose.Schema({
  customer_id: {
    type: String
  },
  date: {
    type: Date
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  zip: {
    type: String
  },
  telephone: {
    type: String
  },
  payment_method: {
    type: String
  },
  name_card: {
    type: String
  },
  creditcard_number: {
    type: String
  },
  creditcard_type: {
    type: String
  },
  expiration: {
    type: String
  },
  cvv: {
    type: String
  },
  order: {
    type: String
  },
  total_price: {
    type: String
  }
});

const Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.addOrder = (newOrder, callback) => {
      newOrder.save(callback);
}
