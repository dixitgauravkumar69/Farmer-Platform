const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  name:String,
  buyerEmail:String,
  buyingPreference:String,
  buyingQuantity:String,
  address:String // Ensure address is included
});

const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;
