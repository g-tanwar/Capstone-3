const express = require('express');
const router = express.Router();
const pomodoroController = require('../controllers/pomodoroController');
const auth = require('../middleware/auth');

router.post('/', auth, pomodoroController.logSession);
router.put('/progress', auth, pomodoroController.updateProgress);
router.get('/', auth, pomodoroController.getSessions);

module.exports = router;
