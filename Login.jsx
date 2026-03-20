import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.reload();
    } catch (err) {
      setError(err?.response?.data?.error || 'Login Error');
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4">Ghana School Login</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}
      <form onSubmit={submit}>
        <label className="block mb-2">Email</label>
        <input className="w-full border p-2 rounded mb-3" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label className="block mb-2">Password</label>
        <input className="w-full border p-2 rounded mb-4" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
};
