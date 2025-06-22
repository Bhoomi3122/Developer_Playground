const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const authRoutes = require('./Routes/auth');
const codeRoutes = require('./Routes/code'); // ✅ import code routes
const AIRoutes = require('./Routes/AI');

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
