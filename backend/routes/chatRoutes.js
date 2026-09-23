const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ รองรับทั้ง /messages/:roomId และ /:roomId เพื่อป้องกัน URL ไม่ตรงกัน
router.post('/consult', authMiddleware, chatController.requestConsult);
router.get('/consult/:id', authMiddleware, chatController.getConsultStatus);
router.get('/:requestId/messages', authMiddleware, chatController.getMessages);
router.post('/:requestId/messages', authMiddleware, chatController.sendMessage);

module.exports = router;