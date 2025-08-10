import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './Routes/auth.js';
import codeRoutes from './Routes/code.js'; // ✅ ensure .js is added
import AIRoutes from './Routes/AI.js';

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(cors({
  origin: ['http://localhost:5173','https://developer-playground.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,  // If you use cookies or authentication
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// API Routes
app.use('/api/auth', authRoutes);    // 🔐 Auth routes
app.use('/api/code', codeRoutes);    // 💾 Code-saving routes
app.use('/api/enhance', AIRoutes);  

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// Root Route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 Handler (optional)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
