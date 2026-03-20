const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();
router.use(authenticate);

router.post("/", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER"), async (req, res) => {
  try {
    const { studentId, amount, category, paidVia, transactionId } = req.body;
    const payment = await prisma.feePayment.create({
      data: {
        studentId,
        amount,
        category,
        paidVia,
        transactionId,
      },
    });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:studentId", authorizeRoles("ADMIN", "HEADTEACHER", "TEACHER", "PARENT", "STUDENT"), async (req, res) => {
  try {
    const x = await prisma.feePayment.findMany({
      where: { studentId: parseInt(req.params.studentId, 10) },
      orderBy: { paidAt: "desc" },
    });
    res.json(x);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
