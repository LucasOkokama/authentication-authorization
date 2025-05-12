const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkSession = require('../middlewares/checkSession');

router.post('/registration', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/profile', checkSession, userController.profile);

module.exports = router;
