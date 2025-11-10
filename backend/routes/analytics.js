const express = require('express');
const router = express.Router();
const ac = require('../controllers/analyticsController');
const auth = require('../middleware/firebaseAuth');

router.get('/owner', auth, ac.ownerDashboard);
router.get('/user', auth, ac.userDashboard);

module.exports = router;