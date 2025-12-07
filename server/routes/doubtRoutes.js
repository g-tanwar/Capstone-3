const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');

const auth = require('../middleware/auth');

router.get('/', doubtController.getAllDoubts); // Public read
router.post('/', auth, doubtController.createDoubt);
router.get('/:id', doubtController.getDoubtById);
router.put('/:id', auth, doubtController.addAnswer);
router.post('/:id/answers', auth, doubtController.addAnswer);
router.delete('/:id', auth, doubtController.deleteDoubt);
router.post('/:id/vote', auth, doubtController.voteDoubt);

module.exports = router;
