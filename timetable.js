const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const prisma = new PrismaClient();

const router = express.Router();
router.use(authenticate);

router.post("/", authorizeRoles("ADMIN", "HEADTEACHER"), async (req, res) => {
  try {
    const { level, className, dayOfWeek, period, subject, teacherId } = req.body;
    const entry = await prisma.timetableEntry.create({
      data: { level, className, dayOfWeek, period, subject, teacherId },
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER", "PARENT", "STUDENT"), async (req, res) => {
  try {
    const entries = await prisma.timetableEntry.findMany({ orderBy: [{ level: "asc" }, { dayOfWeek: "asc" }, { period: "asc" }] });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
