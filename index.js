const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const { verify } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

const router = require('./routes/index');
const port = 5000 || process.env.PORT;

const flash = require('connect-flash');
const flashMware = require('./config/flash-middleware');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    name: 'news_bingo',
    secret: 'secretisoutfinally',
    resave: false,
    saveUninitialized: false,
    cookie: {
      //secure:true,
      httpOnly: true,
      maxAge: 20 * 60 * 1000,
    },
  })
);
app.use(flash());
app.use(flashMware.setflash);
app.use(express.static('./assets'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
//use router
app.use('/', router);

//listening to port
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server runnin on ${port}`);
  }
});
