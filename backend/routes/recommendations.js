const express = require('express');
const router = express.Router();
const rc = require('../controllers/recommendationController');
const auth = require('../middleware/firebaseAuth');

router.post('/', auth, rc.recommend);

module.exports = router;