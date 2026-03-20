const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const assessmentRoutes = require("./routes/assessments");
const attendanceRoutes = require("./routes/attendance");
const feeRoutes = require("./routes/fees");
const timetableRoutes = require("./routes/timetable");
const announcementsRoutes = require("./routes/announcements");
const smsRoutes = require("./routes/sms");
const reportCardsRoutes = require("./routes/reportcards");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/reportcards", reportCardsRoutes);

app.get("/api/status", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
