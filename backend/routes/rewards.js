const express = require('express');
const router = express.Router();
const rc = require('../controllers/rewardController');
const auth = require('../middleware/firebaseAuth');

router.get('/:uid', auth, rc.getUserRewards);

module.exports = router;