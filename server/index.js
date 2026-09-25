const express = require('express');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require("path");
const Product = require('./models/product');
const Review = require('./models/review');
const Order = require('./models/order');
const { ObjectId } = require('mongodb');
const { OAuth2Client } = require('google-auth-library');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 120 * 1000, // 2 minute
  max: 200, // Limit each IP to 5 requests per windowMs
   handler: (req, res, next, options) => {
    // Send a structured JSON response back to the front
    res.status(options.statusCode).json({
      success: false,
      error: 'Too many submissions. Please wait 2 minutes and try again.'
    });
  }
});

const User = require('./models/user'); // Replace with your actual User model path
const app = express()
            //,bodyParser = require("body-parser");
dotenv.config();

// Don't put any keys in code. See https://docs.stripe.com/keys-best-practices.
// Find your keys at https://dashboard.stripe.com/apikeys.
const stripe = require('stripe')(process.env.SECRET_KEY);

const product = async() => {
  return await stripe.products.create({
    name: 'Example Product',
    default_price_data: {
      currency: 'usd',
      unit_amount: 2000,
    },
});
}
const MONGOURL = process.env.MONGO_URL;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

var store = new MongoDBStore({
    uri: MONGOURL,
    collection: 'sessions'
  });

//app.use(bodyParser.json());
app.use(express.static(
    path.join(__dirname,"./dist")));
    
app.use(cors({
  origin: 'http://localhost:5173', // Your exact React URL
  credentials: true // 🔑 Allows cookies to travel back and forth
}));

app.use(session({
  secret: 'a-very-long-random-string-that-nobody-can-guess', // Keep this secret!
  resave: false, // Don't save session if it wasn't modified
  saveUninitialized: false, // Don't create sessions for users who haven't logged in
  store: store,
  cookie: {
    httpOnly: true, // 🛡️ Protects against XSS
    secure: false, // Set to true if you eventually use HTTPS (production)
    maxAge: 1000 * 60 * 60 * 24 * 7 // Session lasts 1 week
  }
}));
/*app.use(session({
    secret: 'some secret',
    cookie: {maxAge: 1000*60*60*24},
    store:store,
    resave:false,
    saveUninitialized: false  
}));*/

app.use(express.urlencoded({ extended: true }));

// Place this BEFORE app.use(express.json());
app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Get this from your Stripe Dashboard
  
  let event;

  try {
    // Verify the event actually came from Stripe
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // This is the user._id you passed during checkout!
    const userId = session.client_reference_id; 

    try {
      // 1. Fetch the user and their cart
      const user = await User.findById(userId).populate('cart.product');
      let parrots = [];
      if (user && user.cart.length > 0) {
        user.cart.forEach(item => {
          if(item.product.category === 'Parrot') {
            parrots.push(item.product.name);
          }
        })
        // 2. Create the order using your existing Order model

        const newOrder = new Order({
          user: user._id,
          products: user.cart,
          total: session.amount_total / 100, // Convert Stripe cents back to dollars
          date: new Date(),
          stripeSessionID: session.id,
          parrots: parrots
        });
        
        await newOrder.save();

        // 3. Clear the user's cart now that they've purchased the items
        if (user && user.cart.length > 0) {
          // 1. Prepare bulk decrement operations for product inventory
          const bulkStockOps = user.cart.map(item => {
  // Determine the correct field path string in MongoDB
  const fieldPath = item.sizeIndex != null 
    ? `quantityArray.${item.sizeIndex}` 
    : 'quantity';

  return {
    updateOne: {
      filter: { _id: item.product._id },
      update: { 
        $inc: { [fieldPath]: -item.requestedAmnt } 
      }
    }
  };
});

        // 2. Execute all inventory updates in one database round-trip
        await Product.bulkWrite(bulkStockOps);
        user.cart = [];
        await user.save();
      }
        console.log(`Order saved successfully for user: ${user.email}`);
      }
    } catch (error) {
      console.error("Error saving order:", error);
      return response.status(500).end();
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.use(express.json());



app.listen(8080, () => {
    console.log('server listening on port 8080')
    
})

mongoose.connect(MONGOURL).then(()=> {
    console.log("DB connected");
})

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
  });

  app.get('/shop', (req,res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
  });

  app.get('/product/:id', (req,res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
  });

  app.get('/checkout', (req,res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
  });

app.post('/checkout', limiter, async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await User.findById(req.session.user._id).populate('cart.product');

    // 1. Create a Stripe Customer if they don't have one saved yet
    let customerId = user.stripeID;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      customerId = customer.id;
      
      // Save customerId to your Mongo DB user document
      user.stripeID = customerId;
      await user.save();
    }

    const lineItems = user.cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.product.name },
        unit_amount: Math.round(item.sizeIndex != null ? item.product.priceArray[item.sizeIndex] * 100 : item.product.price * 100),
      },
      quantity: item.requestedAmnt,
    }));

    // 2. Pass `customer` to the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId, // 👈 Assign customer ID here
      line_items: lineItems,
      mode: 'payment',
      client_reference_id: user._id.toString(),
      billing_address_collection: 'required',
      //Tells Stripe to update the customer profile with the checkout data
    customer_update: {
      address: 'auto',
      name: 'auto', // (Optional) Updates their profile name if they enter a new one
      shipping: 'auto' // Uncomment this if you are using shipping_address_collection too!
    },
      shipping_address_collection: {
    allowed_countries: ['US'], 
  },
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/checkout',
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-portal-session', limiter, async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
  console.log(req.body.currentURL)
  try {
    const user = await User.findById(req.session.user._id);
    let customerId = user.stripeID;

    // 1. If they don't have an ID, create one silently!
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      customerId = customer.id;
      
      // Save it to your database so they have it for next time
      user.stripeID = customerId;
      await user.save();
    }

    // 2. Now open the portal using the existing or brand new ID
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: req.body.currentURL, 
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Portal Error:', error);
    res.status(500).json({ error: 'Could not open portal' });
  }
});

/*app.post('/saveOrder', async (req,res) => {
  console.log("Saving of the orders")
})*/

  app.get('/me', async (req, res) => {
  if (req.session.user) {
    let user = await User.findOne({ _id: req.session.user._id }).populate('cart.product',"-description");
    //console.log(req.session.user)
    req.session.user = user; // Update the session cart with the latest from the database
    //await req.session.user.save(); // Save the updated session
    //console.log("User is logged in:", user.email);
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

  app.post('/login', async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Ask Google to verify if this token is real and untampered
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });

    // 2. Unpack the user's data from Google
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // 3. Check MongoDB: Does this user exist already?
    let user = await User.findOne({ email: email });

    if (!user) {
      // If they don't exist, create a new user with empty cart and orders arrays!
      user = new User({
        name: name,
        picture: picture,
        email: email,
        cart: [],   // Starts empty
        orders: []  // Starts empty
      });
      await user.save();
      console.log('New user created in MongoDB!');
    } else {
      console.log('Existing user logged in!');
    }
    req.session.user = {
    _id: user._id,
    name: name,
    email: email,
    picture: picture,
    cart: user.cart,
    orders: user.orders
  };

    // 4. Send the user back to the frontend
    res.status(200).json({ message: "Login successful", user: req.session.user });

  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ success: false, message: 'Invalid Google token' });
  }
});



app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Could not log out");
    res.clearCookie('connect.sid'); // The default name of the cookie
    res.status(200).send("Logged out");
  });
});

app.get("/getParrots", async (req,res,next) => {
    let response = await Product.find({category:'Parrot'}).select("name key category").select({images:{$slice: 1}}).exec();
    res.json(response);
},);

app.get("/getProducts", async (req,res,next) => {
    let response = await Product.find({category:{ $ne: 'Parrot' }}).select("name key category").select({images:{$slice: 1}}).exec();
    //console.log(response)
    res.json(response);
},);

app.get("/getProduct/:id", async (req,res,next) => {
  
    let response = await Product.findOne({ _id: req.params.id }).exec();
    //console.log(response);
    res.json(response);
},);

app.post("/updateCart", limiter, async (req,res,next) => {

  let user = await User.findOne({ _id: req.session.user._id }).populate('cart.product',"-description");
  let item = user.cart.find(e => e.product._id  == req.body.productID);
  //let product = await Product.findOne({ _id: req.body.productID }).exec();
  //console.log(item.product.quantityArray.length > 0? "Hi" : "Bye")
  //console.log(item)
  if(req.body.input > 0 && req.body.input <= 
  (item.product.quantityArray.length > 0? item.product.quantityArray[req.body.arrIndex] : item.product.quantity)) {
      item.requestedAmnt = req.body.input;
      await user.save();
      user = await user.populate('cart.product',"-description");
      //console.log(item.requestedAmnt)
      console.log("Quantity updated" + " " + item.requestedAmnt);
      res.status(200).json({ message: "Quantity updated successfully.", user: user});
  }
  else if(req.body.input == 0){
// Remove the item where the product field matches the productID
      //user.cart.pull({ product: req.body.productID });
      console.log("Item deleted")
      user.cart = user.cart.filter(item => item.product._id.toString() !== req.body.productID);
  
  // Save the changes to the database
  await user.save();
  user = await user.populate('cart.product',"-description");
  //console.log(req.body.input + " " + user);
  //console.log(user)
  res.status(200).json({ message: "Item removed from cart.", user: user});
  }
  else {
       console.log("Input too large or negative");
  res.status(200).json({ message: "Input too large or negative value"});
  }
  



},);

app.post("/add2Cart", limiter, async (req,res,next) => {
    
  let user = await User.findOne({ _id: req.session.user._id });
  let item = user.cart.find(e => e.product == req.body.productID);
  let product = await Product.findOne({ _id: req.body.productID }).exec();
  //user.cart
  console.log(req.body.sizeIndex);

  if(!item) {
    user.cart.push({
          product: req.body.productID,
          key: product.key,
          requestedAmnt: 1,
          priceAtPurchase: req.body.sizeIndex != null ? product.priceArray[req.body.sizeIndex] : product.price,
          category: product.category,
          sizeIndex: req.body.sizeIndex != null ? req.body.sizeIndex : null
        })
    await user.save();
    user = await user.populate('cart.product',"-description");
    //console.log(user.cart);
    console.log("Added to cart");
    res.status(200).json({ message: "Added to cart", user: user});

  }
  else {
    console.log("Item already in cart.");
    res.status(400).send("Item already in cart. Too change quantity, please modify from cart page. Thank you.");


  }


    
},);

app.post("/getOrderHistory", limiter, async (req,res,next) => {
  const orders = await Order.find({ user: req.session.user._id })
      .populate('products.product', 'images')
      .exec();

    res.json(orders);
  
},)


app.get("/getOrder/:id",limiter, async (req,res,next) => {
  const order = await Order.findOne({ _id: req.params.id })
      .populate('products.product', '-description')
      .exec();
      
  console.log(order);
  res.json(order);
},)

app.get("/testimonials",limiter, async (req,res,next) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
},)

app.get("/getReviews", limiter, async (req,res,next) => {
  let response = await Review.find().exec();
  //console.log(response);
  res.json(response);
},)

app.get("/getUserReviews", limiter, async (req,res,next) => {
  let response = await Review.find({user: req.session.user._id}).populate('user', 'name').exec();
  console.log(response);
  res.json(response);
},)

app.post("/postReview", limiter, async (req,res,next) => {
  //console.log(req.body);
  let found = await Review.findOne({orderID:req.body.orderID});
  console.log(req.session.user)
  

  if (found == null) {
    console.log("OrderID not found...creating new review")
  try {
    let review = new Review({
      _id: new ObjectId(),
      user: req.session.user._id,
      name: req.body.name,
      description: req.body.description,
      rating: req.body.rating,
      orderID: req.body.orderID,
      parrots: req.body.parrots
    });
    
    await review.save();
    
    // Send a 201 Created status for a successful submission
    res.status(201).json({ message: "Review Submitted" });
    
  } catch (err) {
    // Check if the error is a Mongoose validation error (e.g., missing fields, too short)
    if (err.name === 'ValidationError') {
      // Extract all the specific error messages from Mongoose
      const validationErrors = Object.values(err.errors).map(val => val.message);
      
      // 400 Bad Request is the correct status for client input errors
      return res.status(400).json({ 
        error: "Validation failed", 
        messages: validationErrors 
      });
    }

    // Handle any other unexpected server errors (e.g., database connection dropped)
    console.error(err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
}
  else {
    res.status(500).json({error:`Review already exists for OrderID`})

  }

  
},)

app.post("/editReview", limiter, async (req,res,next) => {

  try {
    const orderID = req.body.orderID;
    
    // Extract only the fields that are allowed to be updated
    const { name, description, rating } = req.body;

    const updatedReview = await Review.findOneAndUpdate(
      { orderID: orderID },
      { name, description, rating },
      { 
        new: true,           // Returns the updated document instead of the old one
        runValidators: true  // Forces Mongoose to evaluate the minLength and required rules
      }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
     let reviews = await Review.find({user: req.session.user._id}).populate('user', 'name').exec();

    res.status(200).json(reviews);

  } catch (error) {
    // Handles CastErrors (invalid ID format) or ValidationErrors (failed minLength)
    res.status(400).json({ error: error.message });
  }



  
},)

app.post("/deleteReview", limiter, async (req,res,next) => {
  try {
  let response = await Review.deleteOne({_id: req.body.id});
  console.log(response);
  res.json(response);
}
catch (error) {
  res.status(500).json({ error: "An internal server error occurred" });
}
},)