const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const prisma = new PrismaClient();

const router = express.Router();

router.use(authenticate);

router.post("/", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER"), async (req, res) => {
  try {
    const { userId, dob, gender, ghanaCard, nhisId, level, admissionDate, status, house, isBoarding, admissionType, parentId } = req.body;

    const student = await prisma.student.create({
      data: {
        userId,
        dob: new Date(dob),
        gender,
        ghanaCard,
        nhisId,
        level,
        admissionDate: new Date(admissionDate),
        status,
        house,
        isBoarding,
        admissionType,
        parentId,
      },
      include: { user: true, parent: true },
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER", "PARENT"), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "PARENT") {
      const parent = await prisma.parent.findUnique({ where: { userId: req.user.id } });
      if (!parent) return res.status(404).json({ error: "Parent record not found" });
      query = { parentId: parent.id };
    }
    const students = await prisma.student.findMany({ where: query, include: { user: true, parent: true } });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER", "PARENT", "STUDENT"), async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id, 10) },
      include: { user: true, parent: true, assessments: true, attendances: true },
    });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER"), async (req, res) => {
  try {
    const data = req.body;
    if (data.dob) data.dob = new Date(data.dob);
    if (data.admissionDate) data.admissionDate = new Date(data.admissionDate);

    const student = await prisma.student.update({
      where: { id: parseInt(req.params.id, 10) },
      data,
    });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
