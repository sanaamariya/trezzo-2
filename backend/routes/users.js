const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/firebaseAuth');

// sync user from Firebase - protected (token verifies the same uid)
router.post('/sync', auth, userController.syncUser);

// update preferences
router.put('/:uid/preferences', auth, userController.updatePreferences);

// update reward points (admin or user)
router.put('/:uid/rewards', auth, userController.updateRewards);

// get user dashboard
router.get('/:uid/dashboard', auth, userController.getDashboard);

module.exports = router;