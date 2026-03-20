function computeGrade(totalScore) {
  if (totalScore >= 80) return { grade: "1", remark: "Excellent" };
  if (totalScore >= 70) return { grade: "2", remark: "Very Good" };
  if (totalScore >= 60) return { grade: "3", remark: "Good" };
  if (totalScore >= 50) return { grade: "4", remark: "Credit" };
  if (totalScore >= 45) return { grade: "5", remark: "Pass" };
  return { grade: "6", remark: "Fail" };
}

module.exports = { computeGrade };
