const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller2');

router.get('/', homeController.home);
router.get('/register', homeController.register);
router.post('/register/create', homeController.create);
router.get('/login', homeController.login);
router.get(
  '/logout',
  homeController.authorization,
  homeController.destroySession
);
router.get('/profile', homeController.authorization, homeController.profile);
router.post('/signIn', homeController.signIn);
router.get('/forgotPassword', homeController.forgotPassword);
router.post('/updatePassword', homeController.updatePassword);
router.get('/settings', homeController.settings);
router.get('/edit-subscription', homeController.editSubscription);
router.post('/update-Subscription', homeController.updateSubscription);
router.get('/homepage', homeController.homepage);
module.exports = router;
