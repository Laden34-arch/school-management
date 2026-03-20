import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Fees() {
  const [studentId, setStudentId] = useState('');
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ amount: 0, category: 'tuition', paidVia: 'MTN MoMo', transactionId: '' });
  const [message, setMessage] = useState('');

  const loadPayments = async () => {
    if (!studentId) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/fees/${studentId}`, { headers: { Authorization: `Bearer ${token}` } });
      setPayments(data);
      setMessage('');
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Unable to load payments');
    }
  };

  const addPayment = async (e) => {
    e.preventDefault();
    if (!studentId) {
      setMessage('Provide student ID');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/fees`, { studentId: Number(studentId), ...form }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Payment recorded');
      loadPayments();
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Unable to submit payment');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Fees Management</h2>
      <div className="mb-4">
        <input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="border p-2 rounded mr-2" placeholder="Student ID" />
        <button onClick={loadPayments} className="bg-blue-600 text-white px-3 py-2 rounded">Load payments</button>
      </div>
      {message && <p className="text-green-700 mb-2">{message}</p>}
      <form onSubmit={addPayment} className="bg-white rounded shadow p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input type="number" value={form.amount} min="0" onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))} className="border p-2 rounded" placeholder="Amount (GHS)" required />
          <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="border p-2 rounded">
            <option value="tuition">Tuition</option>
            <option value="pta">PTA</option>
            <option value="feeding">Feeding</option>
            <option value="boarding">Boarding</option>
          </select>
          <select value={form.paidVia} onChange={(e) => setForm((f) => ({ ...f, paidVia: e.target.value }))} className="border p-2 rounded">
            <option>MTN MoMo</option>
            <option>Vodafone Cash</option>
            <option>AirtelTigo</option>
          </select>
          <input value={form.transactionId} onChange={(e) => setForm((f) => ({ ...f, transactionId: e.target.value }))} className="border p-2 rounded" placeholder="Tx ID" required />
        </div>
        <button type="submit" className="mt-3 bg-green-600 text-white px-4 py-2 rounded">Record payment</button>
      </form>

      <div className="grid gap-2">
        {payments.map((p) => (
          <div key={p.id} className="bg-white p-3 rounded shadow">
            <p>{new Date(p.paidAt).toLocaleString()} - {p.category} - GHS {p.amount}</p>
            <p>Via {p.paidVia} | Tx {p.transactionId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
