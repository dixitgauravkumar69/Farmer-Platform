const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userdb', {
  
});

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  midName: { type: String },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
   // 'farmer' or 'buyer'
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
