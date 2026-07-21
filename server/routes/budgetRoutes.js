const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getAll, create, update, remove } = require('../controllers/budgetController');

router.use(authenticate);
router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
