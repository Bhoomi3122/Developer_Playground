import express from 'express';
import { signup, login, getUser } from '../Controllers/authController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);

// Get logged in user info (protected)
router.get('/me', authMiddleware, getUser);

export default router;

