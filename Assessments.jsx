import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/assessments/${studentId}`, { headers: { Authorization: `Bearer ${token}` } });
      setAssessments(data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assessments</h2>
      <div className="mb-4">
        <input type="number" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="border p-2 rounded w-36" placeholder="Student ID" />
        <button onClick={load} className="ml-2 px-3 py-2 bg-blue-600 text-white rounded">Load</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="space-y-3">
        {assessments.map((a) => (
          <div key={a.id} className="bg-white p-3 rounded shadow">
            <p><strong>Subject:</strong> {a.subject}</p>
            <p><strong>Term:</strong> {a.term}</p>
            <p><strong>CA:</strong> {a.caScore} | <strong>Exam:</strong> {a.examScore}</p>
            <p><strong>Total:</strong> {a.totalScore} | <strong>Grade:</strong> {a.grade}</p>
            <p><strong>Remarks:</strong> {a.remarks}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
