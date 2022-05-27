const pool = require('../config/db');
const axios = require('axios');
const bcrypt = require('bcrypt');

//homepage controller
module.exports.home = function (req, res) {
  return res.render('home', {
    title: 'Homepage',
  });
};
//forgot password
module.exports.forgotPassword = function (req, res) {
  return res.render('forgot_pwd', {
    title: 'forgotPassword',
  });
};
//password updation
module.exports.updatePassword = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect('back');
  }
  try {
    const body = req.body;
    //  console.log(body);
    const userPass = req.body.password;
    const userEmail = req.body.email;
    //  console.log('useremail', userEmail);
    //  console.log('userPass', userPass);
    //queries for password updation
    const updatepass = await pool.query(
      'UPDATE users SET password = $1 WHERE email= $2',
      [userPass, userEmail]
    );
    //  console.log(updatepass);
    return res.redirect('/login');
  } catch (error) {
    console.log(error.message);
  }
};
//register page
module.exports.register = function (req, res) {
  return res.render('register', {
    title: 'Registerpage',
  });
};
//login page
module.exports.login = function (req, res) {
  return res.render('login', {
    title: 'Loginpage',
  });
};
//sign-in user creation
module.exports.create = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect('back');
  }
  try {
    const body = req.body;
    console.log(body);
    const { name, age, email, profession, sex, subscription, password } =
      req.body;
    //bcrypt password operation

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        console.log(err.message);
      } else {
        console.log('password-bcrypt-hash :', hash);
        const hashedPassword = hash;
        //inserting user into db
        console.log('password-bcrypt-hashedPass :', hashedPassword);
        const newUser = await pool.query(
          'INSERT INTO users (name,age,email,profession,sex,subscription,password) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
          [name, age, email, profession, sex, subscription, hashedPassword]
        );

        ///
      }
    });
    //

    return res.redirect('/login');
  } catch (error) {
    console.log(error.message);
  }
};
//profile page
module.exports.profile = async function (req, res) {
  if (req.cookies.news_bingo) {
    console.log(req.cookies.news_bingo);
    console.log(req.session.email);
    const email = req.session.email;

    //getting the subscriptions
    const findUser = await pool.query('SELECT * FROM users WHERE email=$1', [
      email,
    ]);
    const subsList = findUser.rows[0].subscription;
    const subsLength = findUser.rows[0].subscription.length;
    // console.log(findUser.rows[0].subscription);
    // console.log(findUser.rows[0].subscription.length);
    // console.log(findUser.rows[0].subscription[0]);
    // console.log(findUser.rows[0].subscription[1]);
    // console.log(findUser.rows[0].subscription[2]);
    //get the news//busineess,headlines sports technology

    try {
      const newsData = [];
      for (var i = 0; i < findUser.rows[0].subscription.length; i++) {
        if (findUser.rows[0].subscription[i] == 'Business') {
          const newsBusinessAPI = await axios.get(
            'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=ca73a18f0fee4491a7cb22b9979cb8fa'
          );
          newsData.push(newsBusinessAPI);
        } else if (findUser.rows[0].subscription[i] == 'Headlines') {
          const newsHeadlinesAPI = await axios.get(
            'https://newsapi.org/v2/top-headlines?country=us&apiKey=ca73a18f0fee4491a7cb22b9979cb8fa'
          );
          newsData.push(newsHeadlinesAPI);
        } else if (findUser.rows[0].subscription[i] == 'Sports') {
          const newsSportsAPI = await axios.get(
            'https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=ca73a18f0fee4491a7cb22b9979cb8fa'
          );
          newsData.push(newsSportsAPI);
        } else {
          const newsTechnologyAPI = await axios.get(
            'https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=ca73a18f0fee4491a7cb22b9979cb8fa'
          );
          newsData.push(newsTechnologyAPI);
        }
      }

      //console.log('business', newsBusinessAPI.data.articles);
      //console.log('sports', newsSportsAPI.data.articles);
      //console.log('headlines', newsHeadlinesAPI.data.articles);
      //console.log('technology', newsTechnologyAPI.data.articles);

      // console.log('data from news array', newsData);
      // console.log('data from news array 1', newsData[0].data.articles);
      // console.log('data from news array 1', newsData[1].data.articles);
      // console.log('data from news array 1', newsData[2].data.articles);

      return res.render('profile', {
        articles: newsData,
        total: subsLength,
        fields: subsList,
      });
    } catch (error) {
      console.log(error.message);
    }
  } else {
    return res.redirect('/login');
  }
};
//logout
module.exports.destroySession = function (req, res) {
  res.clearCookie('news_bingo');
  return res.redirect('/');
};
//login
module.exports.signIn = async function (req, res) {
  try {
    const body = req.body;
    console.log(body);
    //const { userEmail, userPwd } = req.body;
    const userEmail = req.body.email;
    const userPwd = req.body.password;

    const findUser = await pool.query('SELECT * FROM users WHERE email=$1', [
      userEmail,
    ]);
    const findpwd = await pool.query(
      'SELECT password FROM users WHERE email=$1',
      [userEmail]
    );
    const myHashedDBpassword = findUser.rows[0].password;
    //console.log(req.session);
    req.session.email = userEmail;
    // console.log(req.session);
    // console.log('userPwd', userPwd);
    // console.log('findPwd', findpwd.rows[0].password);
    // console.log('findUser', findUser.rows[0].password);
    console.log('hashedpass: ', myHashedDBpassword);
    console.log('user', userPwd);
    if (findUser) {
      // bcrupt compare

      bcrypt.compare(userPwd, myHashedDBpassword, function (err, result) {
        // result == true
        if (result == true) {
          return res.redirect('/profile');
        } else {
          return res.redirect('/login');
        }
      });

      //
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    console.log(error.message);
  }
};
