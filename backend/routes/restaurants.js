const express = require('express');
const router = express.Router();
const rc = require('../controllers/restaurantController');
const auth = require('../middleware/firebaseAuth');

router.post('/', auth, rc.create);
router.put('/:id', auth, rc.update);
router.delete('/:id', auth, rc.delete);
router.get('/:id', rc.getById);
router.get('/', rc.list);
router.get('/nearby', rc.nearby);
router.post('/compute-awards', auth, rc.computeAwards);

module.exports = router;