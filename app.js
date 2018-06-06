const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Connect to mongoose
mongoose.connect('mongodb://vidjot-user:rainman2002@ds245150.mlab.com:45150/vidjot-prod')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override Middleware
app.use(methodOverride('_method'));

// Session Middleware
app.use(session({
  secret: 'Mike Loves Cats in the Morning',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// Global Vars
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome a'
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('About');
});

// Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, ()=> {
  console.log(`Server Listening on port ${port}`);
});
