//routes for retrieving and updating user data
const userController = require('../controllers/user_controller');
const express = require('express');
const router = express.Router();

const {
	isAuthenticated,
	isAuthenticatedOrGuest
} = require('../services/auth');

router.get('/:user_id', userController.getUserById);

router.get('/', isAuthenticated, userController.getUserData); //this should definitely get all users
router.patch('/', isAuthenticated, userController.updateUserData);

//update:
//router.patch('/', isAuthenticated, userController.updateUserData);
//router.get('/:username', userController.getUserById);

module.exports = router;