const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

// เปิดให้ภายนอกดึงรูปจากโฟลเดอร์ uploads ได้
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'Legal App API is running' });
});

// สร้าง HTTP Server ครอบ Express
const server = http.createServer(app);

// ตั้งค่า Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// ดึง Route ที่มีอยู่เดิม
const authRoutes = require('./routes/authRoutes');
const communityRoutes = require('./routes/communityRoutes');
const ebookRoutes = require('./routes/ebookRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/ebooks', ebookRoutes);
app.use('/api/chat', chatRoutes);

// เรียกใช้ Socket Handler
const setupChatSocket = require('./socket/chatHandler');
setupChatSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running with Socket.io on http://0.0.0.0:${PORT}`);
});