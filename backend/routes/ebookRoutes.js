const express = require('express');
const router = express.Router();
const ebookController = require('../controllers/ebookController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', ebookController.getEbooks);
router.get('/favorites', authMiddleware, ebookController.getFavorites);
router.get('/:id', ebookController.getEbookDetail);
router.post('/:ebookId/favorite', authMiddleware, ebookController.toggleFavorite);

module.exports = router;

