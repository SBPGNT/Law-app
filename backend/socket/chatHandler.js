const prisma = require('../config/db');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('⚡ Client connected:', socket.id);

    // 1. เข้าห้องแชตตาม roomId (รองรับทั้ง { roomId } และ "roomId")
    socket.on('join_room', (data) => {
      const roomId = typeof data === 'object' && data !== null ? data.roomId : data;
      socket.join(roomId);
      console.log(`👤 Socket ${socket.id} joined room: ${roomId}`);
    });

    // 2. รับข้อความ บันทึกลง Database แล้วกระจายหาคนในห้อง
    socket.on('send_message', async (data) => {
      console.log('📩 Received message payload:', data);
      try {
        const { roomId, senderId, content } = data;
        const text = typeof content === 'string' ? content.trim() : '';
        if (
          typeof roomId !== 'string' ||
          !roomId ||
          typeof senderId !== 'string' ||
          !senderId ||
          !text
        ) {
          socket.emit('error_message', { message: 'ข้อมูลข้อความไม่ถูกต้อง' });
          return;
        }

        const newMessage = await prisma.message.create({
          data: {
            requestId: roomId,
            senderId,
            text,
          },
        });

        // ส่งข้อความกระจายให้ทุกคนในห้องแชต
        io.to(roomId).emit('receive_message', {
          ...newMessage,
          content: newMessage.text,
        });
      } catch (error) {
        console.error('Socket send_message error:', error);
        socket.emit('error_message', { message: 'ไม่สามารถส่งข้อความได้' });
      }
    });

    // 3. แจ้งสถานะกำลังพิมพ์ (Typing Indicator)
    socket.on('typing', ({ roomId, userName }) => {
      socket.to(roomId).emit('user_typing', { userName });
    });

    socket.on('stop_typing', ({ roomId }) => {
      socket.to(roomId).emit('user_stop_typing');
    });

    // 4. ออกจากห้อง / ตัดการเชื่อมต่อ
    socket.on('disconnect', () => {
      console.log('🔥 User disconnected:', socket.id);
    });
  });
};