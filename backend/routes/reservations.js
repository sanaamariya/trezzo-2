const express = require('express');
const router = express.Router();
const rc = require('../controllers/reservationController');
const auth = require('../middleware/firebaseAuth');

router.post('/', auth, rc.create);
router.get('/me', auth, rc.userReservations);
router.delete('/:id', auth, rc.cancel);
router.get('/restaurant/:restaurantId', auth, rc.restaurantReservations);

module.exports = router;