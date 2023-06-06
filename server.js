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
app.get('/', function(req, res) { res.render("index.ejs"); });
app.get('/store', function(req, res) { res.render("store.ejs"); });
app.get('/itemDetails', function(req, res) { res.render("itemDetails.ejs"); });
app.get('/login', function(req, res) { res.render("login.ejs"); });
app.get('/register', function(req, res) { res.render("register.ejs"); });
app.get('/listItem', function(req, res) { res.render("listItem.ejs"); });
app.get('/logout', function(req, res) { res.render("logout.ejs"); });

app.post('/login', (req, res) => {
  const { userId } = req.body;

  req.session.userId = userId;
  req.session.isLoggedIn = true;
  req.session.cartItems = [];

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


app.get('/cart', function(req, res) {
  // Fetch the cart items from the session or database
  const cartItems = req.session.cartItems || [];

  res.render("cart.ejs", { cartItems });
});

// Define the route for "/itemDetails"
app.get('/itemDetails', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'itemDetails.html'));
});

app.listen(3000, function() {
  console.log('Listening on port 3000...')
});
