import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getStudents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/students`, { headers: { Authorization: `Bearer ${token}` } });
        setStudents(data);
      } catch (err) {
        setError(err?.response?.data?.error || 'Unable to fetch students');
      } finally {
        setLoading(false);
      }
    };
    getStudents();
  }, []);

  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      {loading && <div>Loading …</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid gap-4">{students.map((s) => (
        <div key={s.id} className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">{s.user.firstName} {s.user.lastName}</h3>
          <p>Level: {s.level}</p>
          <p>Status: {s.status}</p>
          <p>House: {s.house || 'N/A'}</p>
          <p>Admission: {new Date(s.admissionDate).toLocaleDateString()}</p>
        </div>
      ))}</div>
    </main>
  );
}
