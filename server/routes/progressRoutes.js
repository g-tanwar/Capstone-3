const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

router.get('/', auth, progressController.getSummary);

module.exports = router;
