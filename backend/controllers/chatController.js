const prisma = require('../config/db');

exports.requestConsult = async (req, res) => {
  try {
    const { subject, events, message } = req.body;
    const request = await prisma.lawyerRequest.create({
      data: {
        subject,
        events,
        message,
        userId: req.user.userId,
      },
    });
    return res.status(201).json(request);
  } catch (error) {
    console.error('Create consult request error:', error);
    return res.status(500).json({ message: 'ไม่สามารถส่งคำขอปรึกษาได้' });
  }
};

exports.getConsultStatus = async (req, res) => {
  try {
    const request = await prisma.lawyerRequest.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      select: { id: true, status: true },
    });
    if (!request) {
      return res.status(404).json({ message: 'ไม่พบคำขอปรึกษา' });
    }
    return res.json(request);
  } catch (error) {
    console.error('Get consult status error:', error);
    return res.status(500).json({ message: 'ไม่สามารถตรวจสอบสถานะได้' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const request = await prisma.lawyerRequest.findFirst({
      where: { id: req.params.requestId, userId: req.user.userId },
      select: { id: true },
    });
    if (!request) {
      return res.status(404).json({ message: 'ไม่พบห้องสนทนา' });
    }

    const messages = await prisma.message.findMany({
      where: { requestId: request.id },
      orderBy: { createdAt: 'asc' },
    });
    return res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({ message: 'ไม่สามารถโหลดข้อความได้' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
    const request = await prisma.lawyerRequest.findFirst({
      where: { id: req.params.requestId, userId: req.user.userId },
      select: { id: true },
    });
    if (!request) {
      return res.status(404).json({ message: 'ไม่พบห้องสนทนา' });
    }
    if (!text) {
      return res.status(400).json({ message: 'กรุณากรอกข้อความ' });
    }

    const message = await prisma.message.create({
      data: {
        requestId: request.id,
        senderId: req.user.userId,
        text,
      },
    });
    return res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ message: 'ไม่สามารถส่งข้อความได้' });
  }
};
