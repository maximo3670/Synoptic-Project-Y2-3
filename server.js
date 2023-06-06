const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// Connects to the database script
const db = require('./database');

app.use(express.static("public"));
app.set("view engine", "ejs");

// Body parser middleware
app.use(bodyParser.json());
const jsonParser = bodyParser.json();

app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn || false;

  res.locals.isLoggedIn = isLoggedIn;
  res.locals.cartItems = [];

  next();
});

// Setting up the webpages and their URLs
app.get('/', function(req, res) { 
  const userId = req.session.userId;
  res.render("index.ejs", { userId });
});

app.get('/store', function(req, res) { 
  const userId = req.session.userId;
  res.render("store.ejs", { userId });
});

app.get('/itemDetails', function(req, res) { 
  const userId = req.session.userId;
  res.render("itemDetails.ejs", { userId });
});

app.get('/login', function(req, res) { 
  const userId = req.session.userId;
  res.render("login.ejs", { userId });
});

app.get('/register', function(req, res) { 
  const userId = req.session.userId;
  res.render("register.ejs", { userId });
});

app.get('/listItem', function(req, res) { 
  const userId = req.session.userId;
  res.render("listItem.ejs", { userId });
});

app.get('/logout', function(req, res) { 
  const userId = req.session.userId;
  res.render("logout.ejs", { userId });
});

app.get('/admin', function(req, res) { 
  const userId = req.session.userId;
  res.render("admin.ejs", { userId });
});

app.get('/cart', function(req, res) {
  const userId = req.session.userId;
  const cartItems = req.session.cartItems || [];
  res.render("cart.ejs", { cartItems, userId });
});


app.post('/login', (req, res) => {
  const { userId } = req.body;

  req.session.userId = userId;
  req.session.isLoggedIn = true;
  req.session.cartItems = [];

  console.log("User:" + userId + " logged in");

  res.status(200).json({ message: 'Session set successfully' });
});

app.post('/logout', (req, res) => {
  req.session.cartItems = [];
  // Clear the session or token
  req.session.destroy((err) => {
    if (err) {
      console.log('Error while destroying session:', err);
    } else {
      console.log('Logout successful');
      res.sendStatus(200);
    }
  });
});

app.get('/allUsersData', function(req, res) {
  db.promise()
    .query('SELECT * FROM shop.users')
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((error) => {
      console.log('ERROR: ', error);
    });
});

app.get('/getItemData', function(req, res) {
  db.promise()
    .query('SELECT * FROM shop.items')
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((error) => {
      console.log('ERROR: ', error);
    });
});

app.get('/requestedItemDetails', function(req, res) {
  const itemId = req.query.idItem;
  console.log("Item: " + itemId);
  db.promise()
    .query('SELECT * FROM shop.items WHERE idItems = ?', [itemId])
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
});

app.get('/getUserDetails', function(req, res) {
  const idUser = req.query.idUser;
  console.log("User: " + idUser);
  db.promise()
    .query('SELECT * FROM shop.users WHERE idUsers = ?', [idUser])
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
});

app.post('/saveItemDetails', function(req, res) {
  const { itemName, itemPrice, itemDescription } = req.body;
  const idusers = req.session.userId;

  db.promise()
    .query('INSERT INTO shop.items (idusers, itemName, itemPrice, itemDescription) VALUES (?, ?, ?, ?)', [idusers, itemName, itemPrice, itemDescription])
    .then(([result]) => {
      console.log('Item details saved successfully');
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
});

app.post('/saveUserDetails', function(req, res) {
  const { userName, firstName, lastName, userAddress, userEmail, userPassword } = req.body;

  db.promise()
    .query('INSERT INTO shop.users (userName, firstName, lastName, userAddress, userEmail, userPassword) VALUES (?, ?, ?, ?, ?, ?)',
      [userName, firstName, lastName, userAddress, userEmail, userPassword])
    .then(([result]) => {
      console.log('User details saved successfully');
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
});

app.post('/updateCartItems', jsonParser, (req, res) => {
  const cartItem = req.body.cartItem;
  const cartItems = req.session.cartItems || [];

  cartItems.push(cartItem);
  req.session.cartItems = cartItems;

  res.status(200).json({ cartItems });
});


app.get('/getCartItems', (req, res) => {
  // Retrieve the cart items from the session or database
  const cartItems = req.session.cartItems || [];

  res.json(cartItems);
});

app.post('/saveContactDetails', function(req, res) {
  const { message } = req.body;
  const idusers = req.session.userId;

  db.promise()
    .query('INSERT INTO shop.contact (idusers, message) VALUES (?, ?)', [idusers , message])
    .then(([result]) => {
      console.log('Contact details saved successfully');
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
});

app.get('/getContactData', function(req, res) {
  db.promise()
    .query('SELECT message, userName, userEmail FROM shop.contact, shop.users WHERE shop.contact.idusers = shop.users.idusers')
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((error) => {
      console.log('ERROR: ', error);
    });
});

app.listen(3000, function() {
  console.log('Listening on port 3000...')
});
