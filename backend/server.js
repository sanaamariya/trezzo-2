require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');

const usersRoutes = require('./routes/users');
const restaurantsRoutes = require('./routes/restaurants');
const offersRoutes = require('./routes/offers');
const reservationsRoutes = require('./routes/reservations');
const reviewsRoutes = require('./routes/reviews');
const rewardsRoutes = require('./routes/rewards');
const analyticsRoutes = require('./routes/analytics');
const recommendationsRoutes = require('./routes/recommendations');

const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Initialize Firebase Admin from service account JSON in env
if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  console.warn('FIREBASE_SERVICE_ACCOUNT_JSON not set; token verification will fail.');
} else {
  let serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  try {
    // If provided as escaped JSON string, parse
    if (typeof serviceAccount === 'string') serviceAccount = JSON.parse(serviceAccount);
    // If private key contains escaped newlines, replace them
    if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Firebase admin initialized');
  } catch (err) {
    console.error('Failed to initialize Firebase admin:', err);
  }
}

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// health
app.get('/', (req, res) => res.send('Food Spot Locator API'));

// error handler
app.use(errorHandler);

// DB + Server
const PORT = process.env.PORT || 5000;
console.log(process.env.PORT);
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set. Exiting.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');

    mongoose.connection.on('connected', () => {
      console.log('✅ Connected to MongoDB:', mongoose.connection.name);
    });
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });