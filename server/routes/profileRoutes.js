const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/profileController');

router.use(authenticate);
router.get('/', getProfile);
router.put('/', updateProfile);

module.exports = router;
