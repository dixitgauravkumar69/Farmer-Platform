const express = require('express');
const hbs = require('hbs');
const path = require('path');
const mongoose=require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
// const router = express.Router();

const User=require('./models/userModel');
const Crop = require('./models/cropModel'); 
const Buyer = require('./models/buyerModel');


const app= express();
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 



app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
  }));

  // Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();  // User is logged in, proceed to the next handler
    } else {
      res.redirect('/login');  // Redirect to login if not logged in
    }
  }
  
app.get("/",function(req,res)
{
    const successMessage = req.session.successMessage;  // Retrieve the success message from session

    // Clear the success message after displaying it
    req.session.successMessage = null;
  
    // Render your home page with the success message (if any)
    res.render('index', { successMessage });
})
app.get("/Registration",function(req,res)
{
    res.render('registration')
})
app.post('/register', async (req, res) => {
    const { 
      first_name, mid_name, last_name, phone, email, password, 
      state, district, city, address 
    } = req.body;
  
    try {
      // Create a new user based on the form data
      const newUser = new User({
        firstName: first_name,
        midName: mid_name,
        lastName: last_name,
        phone,
        email,
        password,
        state,
        district,
        city,
        address,
      });
  
      // Save the new user to the database
      await newUser.save();
      req.session.successMessage = "You are successfully registered!";
      
       res.redirect('/');
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).render('error', { message: 'Error registering user' });
    }
  });
  

  app.get('/login', (req, res) => {
    res.render('login');
  });
  app.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
  
    if (!email || !password || !role) {
      return res.render('login', { error: 'All fields are required.' });
    }
  
    try {
      const user = await User.findOne({ email, password });
      if (!user) {
        return res.render('login', { error: 'Invalid email or password' });
      }
  
      // Store user information and role in the session
      req.session.user = {
        email: user.email,
        role
      };
  
      // Redirect to home after login
      return res.redirect('/');
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).render('error', { message: 'Error logging in' });
    }
  });
  app.get('/logout', (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error logging out");
      }
  
      // Redirect to home page after logout
      res.redirect('/');
    });
  });
  
  // Profile route
app.get('/profile', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');  // Redirect to login if not logged in
    }
  
    // Render the profile page and pass the user data to the template
    res.render('profile');
  });
  

  // Admin verification page
app.get('/admin/verify', (req, res) => {
   
  
    res.render('admin-verify');  // Render the verification page
  });
  
  
  // Handle the verification form submission
app.post('/admin/verify', (req, res) => {
    const { verificationCode } = req.body;
  
    // The specific number required to access the admin page
    const requiredCode = '132005';  // You can change this number to anything you prefer
  
    if (verificationCode === requiredCode) {
      // If the code is correct, redirect the admin to the admin dashboard
      return res.redirect('/admin/dashboard');
    } else {
      // If the code is incorrect, show an error message
      return res.send('Incorrect verification number.');
    }
  });

  // Admin dashboard page
app.get('/admin/dashboard', (req, res) => {
   
  
    res.render('admin-dashboard');  // Render the actual admin dashboard page
  });
  
  app.get('/view-users', async (req, res) => {
    try {
      const users = await User.find();
      res.render('view-users', { users });
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).render('error', { message: "Error fetching users" });
    }
  });

  // Route to delete a user
app.post('/admin/delete/', async (req, res) => {
    console.log('DELETE request received for username:', req.params.username); // Log request
  
    const usernameToDelete = req.params.username;
  
    // Prevent deleting the admin account
    if (usernameToDelete === 'admin') {
      console.log('Admin account cannot be deleted'); // Log error
      return res.send('You cannot delete the admin account.');
    }
  
    try {
      // Find and delete the user by username
      const user = await User.findOneAndDelete({ username: usernameToDelete });
  
      if (!user) {
        console.log('User not found:', usernameToDelete); // Log if user not found
        return res.send('User not found');
      }
  
      console.log('User deleted successfully:', usernameToDelete); // Log success
      res.redirect('/admin?success=User+deleted+successfully');
    } catch (err) {
      console.error('Error deleting user:', err); // Log error
      res.send('Error deleting user');
    }
  });
  

  //MARKET SECTION------------------
  const checkUserRoleAndRedirect = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login'); // If not logged in, redirect to login
    }
    
    // Redirect based on the user's role
    if (req.session.user.role === 'farmer') {
      return res.redirect('/farmer-landing');
    } else if (req.session.user.role === 'buyer') {
      return res.redirect('/buyer-landing');
    }
    
    next();
  };
  app.get('/market', checkUserRoleAndRedirect);
  //if user if farmer page---
  // Farmer landing page route
app.get('/farmer-landing', isAuthenticated, (req, res) => {
    if (req.session.user.role === 'farmer') {
      res.render('farmerLanding');
    } else {
      res.redirect('/login');
    }
  });

  app.get('/market/farmer', isAuthenticated, async (req, res) => {
    if (req.session.user.role === 'farmer') {
      try {
        // Fetch crops added by the logged-in farmer
        const crops = await Crop.find({ farmerEmail: req.session.user.email });
  
        // Render the farmer's market page with the crops
        res.render('farmer', { crops });
      } catch (error) {
        console.error('Error fetching crops:', error);
        res.status(500).render('error', { message: 'Error fetching crops' });
      }
    } else {
      res.redirect('/login');
    }
  });


  app.post('/market/farmer/add-crop', isAuthenticated, async (req, res) => {
    if (req.session.user.role === 'farmer') {
      const { cropName, quantity, price, description } = req.body;
      const farmerEmail = req.session.user.email;  // Get the farmer's email from the session
  
      try {
        // Create a new crop entry
        const newCrop = new Crop({
          farmerEmail,
          cropName,
          quantity,
          price,
          description
        });
  
        // Save the crop to the database
        await newCrop.save();
  
        // After saving, redirect to the farmer's market
        res.redirect('/market/farmer');
      } catch (error) {
        console.error('Error adding crop:', error);
        res.status(500).render('error', { message: 'Error adding crop' });
      }
    } else {
      res.redirect('/login');
    }
  });
  app.get("/logout",function(req,res)
  {
    res.render('index');
  })
  app.post('/market/farmer/delete-crop/:id', isAuthenticated, async (req, res) => {
    if (req.session.user.role === 'farmer') {
      const cropId = req.params.id;
      try {
        const crop = await Crop.findOneAndDelete({ _id: cropId, farmerEmail: req.session.user.email });
        if (!crop) {
          return res.status(404).render('error', { message: 'Crop not found or not authorized to delete' });
        }
        res.redirect('/market/farmer'); // Redirect after deletion
      } catch (error) {
        console.error('Error deleting crop:', error);
        res.status(500).render('error', { message: 'Error deleting crop' });
      }
    } else {
      res.redirect('/login');
    }
  });
  app.get('/market/farmer/edit-crop/:id', isAuthenticated, async (req, res) => {
    if (req.session.user.role === 'farmer') {
      const cropId = req.params.id;
      try {
        const crop = await Crop.findOne({ _id: cropId, farmerEmail: req.session.user.email });
        if (!crop) {
          return res.status(404).render('error', { message: 'Crop not found or not authorized to edit' });
        }
        res.render('edit-crop', { crop }); // Render the edit form
      } catch (error) {
        console.error('Error fetching crop for edit:', error);
        res.status(500).render('error', { message: 'Error fetching crop for edit' });
      }
    } else {
      res.redirect('/login');
    }
  });
  app.post('/market/farmer/edit-crop/:id', isAuthenticated, async (req, res) => {
    if (req.session.user.role === 'farmer') {
      const cropId = req.params.id;
      const { cropName, quantity, price, description } = req.body;
  
      try {
        const crop = await Crop.findOneAndUpdate(
          { _id: cropId, farmerEmail: req.session.user.email },
          { cropName, quantity, price, description },
          { new: true }
        );
  
        if (!crop) {
          return res.status(404).render('error', { message: 'Crop not found or not authorized to edit' });
        }
        
        res.redirect('/market/farmer'); // Redirect after editing
      } catch (error) {
        console.error('Error editing crop:', error);
        res.status(500).render('error', { message: 'Error editing crop' });
      }
    } else {
      res.redirect('/login');
    }
  });
  // Route to fetch buyer information
  app.get('/find-buyer', async (req, res) => {
    try {
        const buyers = await Buyer.find(); // Fetch all buyers from the database
        res.render('find-buyer', { buyers }); // Render the view with buyer data
    } catch (error) {
        console.error('Error fetching buyer data:', error);
        res.status(500).send('Server Error');
    }
  });
  
  // Buyer landing page route
app.get('/buyer-landing', isAuthenticated, (req, res) => {
    if (req.session.user.role === 'buyer') {
      res.render('buyerLanding');
    } else {
      res.redirect('/login');
    }
  });
  
  

  // Route to upload buyer information
app.post('/market/buyer/add-info', isAuthenticated, async (req, res) => {
  if (req.session.user.role === 'buyer') {
  const { name,buyingPreference, contact, address } = req.body;

  const userEmail = req.session.user.email; // Get the buyer's email from the session

  try {
    const newBuyer = new Buyer({
      name:name,
      email: userEmail, // Associate the buyer info with the logged-in user's email
      buyingPreference,
      contact,
      address
    });

    // Save the buyer information to the database
    await newBuyer.save();

    // Redirect to the buyer's market page
    res.redirect('/market/buyer');
  } catch (error) {
    console.error('Error submitting buyer information:', error);
    res.status(500).render('error', { message: 'Error submitting buyer information' });
  }
}
  else {
    res.redirect('/login');
  }
});
app.post('/market/buyer/add-info', isAuthenticated, async (req, res) => {
  try {
    console.log('Received form data:', req.body);
    const newBuyer = new Buyer(req.body);
    await newBuyer.save();
    console.log('Buyer information saved successfully');
    res.redirect('/market/buyer');
  } catch (error) {
    console.error('Error saving buyer info:', error);
    res.status(500).send('Error saving information');
  }
});

  app.post('/market/buyer/delete-buyer/:id', isAuthenticated, async (req, res) => {
    if (req.session.user.role === 'buyer') {
      const buyerId = req.params.id;
      try {
        const buyer = await Buyer.findOneAndDelete({ _id: buyerId, buyerEmail: req.session.user.email });
        if (!buyer) {
          return res.status(404).render('error', { message: 'Crop not found or not authorized to delete' });
        }
        res.redirect('/market/buyer'); // Redirect after deletion
      } catch (error) {
        console.error('Error deleting information:', error);
        res.status(500).render('error', { message: 'Error deleting info' });
      }
    } else {
      res.redirect('/login');
    }
  });

  app.get('/market/buyer/edit-buyer/:id', isAuthenticated, async (req, res) => {
    if (req.session.user.role === 'buyer') {
      const buyerId = req.params.id;
      try {
        const buyer = await Buyer.findOne({ _id: buyerId, buyerEmail: req.session.user.email });
        if (!buyer) {
          return res.status(404).render('error', { message: 'Crop not found or not authorized to edit' });
        }
        res.render('edit-buyer', { buyer }); // Render the edit form
      } catch (error) {
        console.error('Error fetching crop for edit:', error);
        res.status(500).render('error', { message: 'Error fetching crop for edit' });
      }
    } else {
      res.redirect('/login');
    }
  });
  app.post('/market/buyer/edit-buyer/:id', isAuthenticated, async (req, res) => {
    if (req.session.user.role === 'buyer') {
      const buyerId = req.params.id;
      const { name, buyingPrfrence, buyingQuantity, address } = req.body;
  
      try {
        const buyer = await Buyer.findOneAndUpdate(
          { _id: buyerId, buyerEmail: req.session.user.email },
          { name, buyingPrfrence, buyingQuantity, address },
          { new: true }
        );
  
        if (!buyer) {
          return res.status(404).render('error', { message: 'Crop not found or not authorized to edit' });
        }
        
        res.redirect('/market/buyer'); // Redirect after editing
      } catch (error) {
        console.error('Error editing crop:', error);
        res.status(500).render('error', { message: 'Error editing crop' });
      }
    } else {
      res.redirect('/login');
    }
  });
  // Route to fetch buyer information
  app.get('/find-Crop', async (req, res) => {
    try {
        const crops = await Crop.find(); // Fetch all buyers from the database
        res.render('find-Crop', { crops}); // Render the view with buyer data
    } catch (error) {
        console.error('Error fetching crop data:', error);
        res.status(500).send('Server Error');
    }
  });
  
 
app.get("/Scientific_Suggestion",function(req,res)
{
  res.render('suggestion');
})
app.get("/contact",function(req,res)
{
  res.render('contact');
})

// Routes
app.use(adminRoutes);
app.use(userRoutes);
//chatting part of farmer
app.get("/chat",function(req,res)
{
  res.render('chat');
})

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`SERVER IS RUNNING ON port ${PORT}`);
})