const mongoose = require('mongoose');

// Crop schema
const cropSchema = new mongoose.Schema({
  farmerEmail: String,  // Farmer's email to identify who added the crop
  cropName: String,
  quantity: Number,
  price: Number,
  description: String
});

const Crop = mongoose.model('Crop', cropSchema);
module.exports = Crop;
