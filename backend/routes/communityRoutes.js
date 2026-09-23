const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/posts', communityController.getPosts);
router.get('/posts/:id', communityController.getPostDetail);
router.post('/posts', authMiddleware, communityController.createPost);

module.exports = router;

