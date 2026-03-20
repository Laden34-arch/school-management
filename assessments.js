const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { computeGrade } = require("../utils/grades");
const prisma = new PrismaClient();

const router = express.Router();
router.use(authenticate);

router.post("/", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER"), async (req, res) => {
  try {
    const { studentId, term, subject, caScore, examScore, remarks } = req.body;
    if (typeof caScore !== 'number' || typeof examScore !== 'number') {
      return res.status(400).json({ error: "CA and Exam scores must be numeric" });
    }
    const totalScore = caScore + examScore;
    const grading = computeGrade(totalScore);

    const assessment = await prisma.assessment.create({
      data: {
        studentId,
        term,
        subject,
        caScore,
        examScore,
        totalScore,
        grade: grading.grade,
        remarks: remarks || grading.remark,
      },
    });
    res.status(201).json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:studentId", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER", "PARENT", "STUDENT"), async (req, res) => {
  try {
    const assessments = await prisma.assessment.findMany({
      where: { studentId: parseInt(req.params.studentId, 10) },
      orderBy: { createdAt: "desc" },
    });
    return res.json(assessments);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
