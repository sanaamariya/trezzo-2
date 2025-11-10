const express = require('express');
const router = express.Router();
const rc = require('../controllers/reviewController');
const auth = require('../middleware/firebaseAuth');

router.post('/', auth, rc.create);
router.get('/restaurant/:id/sentiment', rc.restaurantSentiment);

module.exports = router;