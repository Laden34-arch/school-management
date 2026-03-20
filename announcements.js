const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const prisma = new PrismaClient();

const router = express.Router();
router.use(authenticate);

router.post("/", authorizeRoles("ADMIN", "HEADTEACHER"), async (req, res) => {
  try {
    const { title, body, audience } = req.body;
    const announcement = await prisma.announcement.create({
      data: {
        title,
        body,
        audience: audience || "ALL",
        createdById: req.user.id,
      },
    });
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER", "PARENT", "STUDENT"), async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
