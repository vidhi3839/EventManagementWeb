const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');

const MongoDBSession = require('connect-mongodb-session')(session);

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(express.static('uploads'));



app.use(cookieParser('DreamStoriesSecure')); 

const store = new MongoDBSession({
  uri: process.env.MONGODB_URI,
  collection : 'MySession',
});

app.use(session({
  secret: 'DreamStoriesSecretSession',
  saveUninitialized: false,
  resave: false,
  store:store,
}));




app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
app.use(fileUpload());

app.set('view engine', 'ejs');

const routes = require('./server/routes/eventsRoutes.js')
app.use('/', routes);

app.listen(port, ()=> console.log(`Listening to port ${port}`));