import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Timetable() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/timetable`, { headers: { Authorization: `Bearer ${token}` } });
        setEntries(data);
      } catch (err) {
        setError(err?.response?.data?.error || 'Unable to load timetable');
      }
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Timetable</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-1 gap-3">
        {entries.map((e) => (
          <div key={e.id} className="bg-white p-3 rounded shadow">
            <p>{e.level} - {e.className} - {e.dayOfWeek} period {e.period}</p>
            <p>{e.subject} (Teacher ID: {e.teacherId || 'N/A'})</p>
          </div>
        ))}
      </div>
    </div>
  );
}
