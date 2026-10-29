const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const travelRoutes = require('./routes/travelRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');

// The Express app is built here and exported. Keeping it separate from the
// listener (server.js) lets the exact same app run both as a normal Node
// process locally and as a serverless function on Vercel.
const app = express();

// Allow the configured client URL plus any localhost/127.0.0.1 dev port.
// Vite automatically falls back to 5174/5175 when 5173 is busy, so a fixed
// origin would otherwise block API requests during local development.
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const isLocalDev = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    return callback(null, origin === CLIENT_URL || isLocalDev);
  }
}));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'TravelMate API running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/travels', travelRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
