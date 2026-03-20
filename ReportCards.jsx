import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function ReportCards() {
  const [studentId, setStudentId] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/reportcards/${studentId}?term=TERM_1`, { headers: { Authorization: `Bearer ${token}` } });
      setReport(data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to load report card');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Report Cards</h2>
      <div className="flex gap-2 mb-4">
        <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Student ID" className="border p-2 rounded" />
        <button onClick={fetchReport} className="bg-blue-600 text-white px-4 py-2 rounded">Load</button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {report && (
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold">{report.student.name}</h3>
          <p>Level: {report.student.level}</p>
          <p>Term: {report.term}</p>
          <p>Class Position: {report.position}</p>
          <p>Attendance: Present {report.attendanceSummary.present}, Absent {report.attendanceSummary.absent}, Late {report.attendanceSummary.late}</p>
          <p>Average: {report.averageScore.toFixed(2)}</p>
          <div className="mt-3">
            <h4 className="font-semibold">Grades</h4>
            <table className="w-full text-left border-collapse border"> 
              <thead><tr><th className="border px-2 py-1">Subject</th><th className="border px-2 py-1">Total</th><th className="border px-2 py-1">Grade</th><th className="border px-2 py-1">Remarks</th></tr></thead>
              <tbody>
                {report.grades.map((g)=> (
                  <tr key={g.subject}>
                    <td className="border px-2 py-1">{g.subject}</td>
                    <td className="border px-2 py-1">{g.totalScore}</td>
                    <td className="border px-2 py-1">{g.grade}</td>
                    <td className="border px-2 py-1">{g.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
