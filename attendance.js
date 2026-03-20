const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const prisma = new PrismaClient();

const router = express.Router();
router.use(authenticate);

router.post("/", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER"), async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        date: new Date(date),
        status,
      },
    });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:studentId", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER", "PARENT", "STUDENT"), async (req, res) => {
  try {
    const attendances = await prisma.attendance.findMany({
      where: { studentId: parseInt(req.params.studentId, 10) },
      orderBy: { date: "desc" },
    });
    res.json(attendances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
