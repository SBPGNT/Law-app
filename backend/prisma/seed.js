const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. บัญชีทนายความตัวอย่าง
  const hashedPassword = await bcrypt.hash('123456', 10);
  const lawyer = await prisma.user.upsert({
    where: { email: 'lawyer@example.com' },
    update: {},
    create: {
      idCard: '1234567890123',
      firstName: 'ทนายสมชาย',
      lastName: 'ใจดี',
      email: 'lawyer@example.com',
      password: hashedPassword,
      role: 'LAWYER'
    }
  });

  // 2. ข้อมูล E-Book ตัวอย่าง (ลบ skipDuplicates ออกแล้ว)
  const ebookCount = await prisma.ebook.count();
  if (ebookCount === 0) {
    await prisma.ebook.createMany({
      data: [
        {
          title: 'ประมวลกฎหมายอาญา ฉบับใช้งานจริง',
          category: 'อาญา',
          description: 'สรุปประมวลกฎหมายอาญามาตราสำคัญ พร้อมตัวอย่างคำพิพากษาฎีกา',
          coverUrl: 'https://via.placeholder.com/150',
          pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          authorName: 'สำนักพิมพ์กฎหมาย',
          publisher: 'Legal Press'
        },
        {
          title: 'สรุปหลักกฎหมายแพ่งและพาณิชย์',
          category: 'แพ่ง',
          description: 'คู่มือทำความเข้าใจกฎหมายนิติกรรม สัญญา และทรัพย์สิน',
          coverUrl: 'https://via.placeholder.com/150',
          pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          authorName: 'ดร. นิติศาสตร์',
          publisher: 'Law Publishing'
        }
      ]
    });
  }

  // 3. โพสต์ตัวอย่างใน Community
  const postCount = await prisma.post.count();
  if (postCount === 0) {
    await prisma.post.create({
      data: {
        title: 'ปรึกษาเรื่องสัญญาเช่าบ้าน โดนยึดเงินประกัน',
        content: 'ย้ายออกจากบ้านเช่าแล้ว แต่ผู้เช่าไม่ยอมคืนเงินประกัน อ้างว่าทำบ้านเสียหาย ควรทำอย่างไรดีครับ?',
        isAnonymous: true,
        authorId: lawyer.id
      }
    });
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });