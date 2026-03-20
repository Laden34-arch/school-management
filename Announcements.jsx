import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', body: '', audience: 'ALL' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/announcements`, { headers: { Authorization: `Bearer ${token}` } });
      setAnnouncements(data);
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Unable to load announcements');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/announcements`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Announcement published');
      setForm({ title: '', body: '', audience: 'ALL' });
      load();
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Unable to publish announcement');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>

      <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4">
        {message && <div className="p-2 mb-2 bg-green-100 text-green-700">{message}</div>}
        <div className="grid gap-3 md:grid-cols-3">
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="border p-2 rounded w-full" required />
          <select value={form.audience} onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))} className="border p-2 rounded" required>
            <option value="ALL">All</option>
            <option value="PARENTS">Parents</option>
            <option value="STUDENTS">Students</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>
        <textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} placeholder="Message body" className="border p-2 rounded w-full h-24 mt-3" required />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Publish</button>
      </form>

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white p-3 rounded shadow">
            <h3 className="font-bold">{a.title}</h3>
            <p className="text-sm text-slate-500">Audience: {a.audience} | Date: {new Date(a.createdAt).toLocaleString()}</p>
            <p>{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
