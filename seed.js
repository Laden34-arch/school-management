const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const teacherPassword = await bcrypt.hash("Teacher123!", 10);
  const parentPassword = await bcrypt.hash("Parent123!", 10);
  const studentPassword = await bcrypt.hash("Student123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ghanaschool.test" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@ghanaschool.test",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@ghanaschool.test" },
    update: {},
    create: {
      firstName: "Mary",
      lastName: "Mensah",
      email: "teacher@ghanaschool.test",
      password: teacherPassword,
      role: "TEACHER",
    },
  });

  const teacherRecord = await prisma.teacher.upsert({
    where: { userId: teacher.id },
    update: {},
    create: {
      userId: teacher.id,
      subjects: ["Mathematics", "Science"],
      assignedClasses: ["JHS_1A"],
    },
  });

  const parent = await prisma.user.upsert({
    where: { email: "parent@ghanaschool.test" },
    update: {},
    create: {
      firstName: "Kwame",
      lastName: "Owusu",
      email: "parent@ghanaschool.test",
      password: parentPassword,
      role: "PARENT",
    },
  });
  const parentRecord = await prisma.parent.upsert({
    where: { userId: parent.id },
    update: {},
    create: {
      userId: parent.id,
      phone: "+233501234567",
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@ghanaschool.test" },
    update: {},
    create: {
      firstName: "Ama",
      lastName: "Adjei",
      email: "student@ghanaschool.test",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      dob: new Date("2013-07-15"),
      gender: "Female",
      nhisId: "NHIS00123",
      level: "JHS_1",
      admissionDate: new Date("2022-09-05"),
      status: "Active",
      house: "Blue",
      isBoarding: false,
      admissionType: "day",
      parentId: parentRecord.id,
    },
  });

  await prisma.assessment.upsert({
    where: { id: 1 },
    update: {
      caScore: 25,
      examScore: 60,
      totalScore: 85,
      grade: "1",
      remarks: "Excellent work",
    },
    create: {
      studentId: student.id,
      term: "TERM_1",
      subject: "Mathematics",
      caScore: 25,
      examScore: 60,
      totalScore: 85,
      grade: "1",
      remarks: "Excellent work",
    },
  });

  await prisma.timetableEntry.upsert({
    where: { id: 1 },
    update: {},
    create: {
      level: "JHS_1",
      className: "JHS_1A",
      dayOfWeek: "Monday",
      period: 1,
      subject: "Mathematics",
      teacherId: teacherRecord.id,
    },
  });

  await prisma.announcement.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Term 1 PTA Meeting",
      body: "All parents are requested to attend the PTA meeting on Friday.",
      audience: "PARENTS",
      createdById: admin.id,
    },
  });

  await prisma.smsLog.upsert({
    where: { id: 1 },
    update: {},
    create: {
      to: "+233501234567",
      message: "Reminder: school reopens on January 10.",
      provider: "MTN MoMo",
      status: "SENT",
    },
  });

  console.log("Seed data created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
