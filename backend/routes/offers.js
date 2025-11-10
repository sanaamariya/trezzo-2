const express = require('express');
const router = express.Router();
const oc = require('../controllers/offerController');
const auth = require('../middleware/firebaseAuth');

router.post('/', auth, oc.create);
router.put('/:id', auth, oc.update);
router.delete('/:id', auth, oc.delete);
router.get('/active', oc.active);

module.exports = router;