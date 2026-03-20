const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const prisma = new PrismaClient();

const router = express.Router();
router.use(authenticate);

router.get("/:studentId", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER", "PARENT", "STUDENT"), async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId, 10);
    const term = req.query.term || "TERM_1";

    const student = await prisma.student.findUnique({ where: { id: studentId }, include: { user: true } });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const assessments = await prisma.assessment.findMany({ where: { studentId, term } });
    const attendance = await prisma.attendance.findMany({ where: { studentId } });

    const totalScore = assessments.reduce((sum, a) => sum + a.totalScore, 0);
    const averageScore = assessments.length > 0 ? totalScore / assessments.length : 0;

    const grades = assessments.map((a) => ({ subject: a.subject, grade: a.grade, totalScore: a.totalScore, remarks: a.remarks }));

    const present = attendance.filter((a) => a.status === 'present').length;
    const absent = attendance.filter((a) => a.status === 'absent').length;
    const late = attendance.filter((a) => a.status === 'late').length;

    const classmates = await prisma.student.findMany({ where: { level: student.level } });
    const classRank = await Promise.all(classmates.map(async (mate) => {
      const mateAssessments = await prisma.assessment.findMany({ where: { studentId: mate.id, term } });
      const mateTotal = mateAssessments.reduce((s, a) => s + a.totalScore, 0);
      const mateAvg = mateAssessments.length > 0 ? mateTotal / mateAssessments.length : 0;
      return { studentId: mate.id, average: mateAvg };
    }));
    const sorted = classRank.sort((a, b) => b.average - a.average);
    const position = sorted.findIndex((x) => x.studentId === studentId) + 1;

    res.json({
      student: { id: student.id, name: `${student.user.firstName} ${student.user.lastName}`, level: student.level },
      term,
      grades,
      averageScore,
      position,
      attendanceSummary: { present, absent, late },
      remarks: 'Keep working hard and maintain discipline',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
