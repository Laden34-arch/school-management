const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const prisma = new PrismaClient();

const router = express.Router();
router.use(authenticate);

router.post("/send", authorizeRoles("ADMIN", "HEADTEACHER"), async (req, res) => {
  try {
    const { to, message, provider } = req.body;
    if (!to || !message) return res.status(400).json({ error: "to and message are required" });

    const sms = await prisma.smsLog.create({
      data: { to, message, provider: provider || "MTN MoMo", status: "SENT" },
    });

    // Stub: integrate with real SMS provider in production.

    res.status(201).json({ success: true, details: sms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/history", authorizeRoles("ADMIN", "HEADTEACHER"), async (req, res) => {
  try {
    const entries = await prisma.smsLog.findMany({ orderBy: { createdAt: "desc" } });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
