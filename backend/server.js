const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path'); // 👈 1. เพิ่มการเรียกใช้งาน path ด้านบน
const { Server } = require('socket.io');
const prisma = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// 👈 2. เพิ่มบรรทัดนี้เพื่อเปิดให้ภายนอกเรียกดูรูปโปรไฟล์ในโฟลเดอร์ uploads ได้
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

// --- Real-time Socket.io Handling ---
io.on('connection', (socket) => {
  console.log('⚡ User connected:', socket.id);

  // เข้าห้องแชตตาม roomId
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`👤 Socket ${socket.id} joined room: ${roomId}`);
  });

  // ส่งข้อความในห้อง
  socket.on('send_message', async (data) => {
    try {
      io.to(data.roomId).emit('receive_message', {
        id: Date.now().toString(),
        roomId: data.roomId,
        senderId: data.senderId,
        senderName: data.senderName,
        content: data.content,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Socket send_message error:', error);
    }
  });

  // ออกจากห้อง / ตัดการเชื่อมต่อ
  socket.on('disconnect', () => {
    console.log('🔥 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running with Socket.io on http://0.0.0.0:${PORT}`);
});