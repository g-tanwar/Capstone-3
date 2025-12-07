const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../middleware/upload');

const auth = require('../middleware/auth');

router.get('/', videoController.getAllVideos); // Public read
router.post('/', auth, upload.single('video'), videoController.createVideo);
router.get('/:id', videoController.getVideoById);
router.put('/:id', auth, videoController.updateVideo);
router.delete('/:id', auth, videoController.deleteVideo);
router.post('/:id/like', auth, videoController.likeVideo);
router.post('/:id/comments', auth, videoController.commentVideo);

module.exports = router;
