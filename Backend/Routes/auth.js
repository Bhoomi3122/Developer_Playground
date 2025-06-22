const express = require('express');
const router = express.Router();

const authController = require('../Controllers/authController');
const authMiddleware = require('../Middleware/authMiddleware');

// Signup
router.post('/signup', authController.signup);

// Login
router.post('/login', authController.login);

// Get logged in user info (protected)
router.get('/me', authMiddleware, authController.getUser);

module.exports = router;
