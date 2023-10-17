const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport')

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));

app.use(cookieParser('DreamStoriesSecure'));
app.use(session({
  secret: 'DreamStoriesSecretSession',
  cookie: {maxAge: 3600000},
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
app.use(fileUpload());

app.set('view engine', 'ejs');

const routes = require('./server/routes/eventsRoutes.js')
app.use('/', routes);

app.listen(port, ()=> console.log(`Listening to port ${port}`));