import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Assessments from './pages/Assessments';
import ReportCards from './pages/ReportCards';
import Timetable from './pages/Timetable';
import Announcements from './pages/Announcements';
import Fees from './pages/Fees';

function App() {
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Login />
      </div>
    );
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="space-x-4">
            <a href="/" className="font-semibold text-slate-700">Dashboard</a>
            <a href="/students" className="text-slate-600 hover:text-slate-900">Students</a>
            <a href="/assessments" className="text-slate-600 hover:text-slate-900">Assessments</a>
            <a href="/reportcards" className="text-slate-600 hover:text-slate-900">Report Cards</a>
            <a href="/timetable" className="text-slate-600 hover:text-slate-900">Timetable</a>
            <a href="/announcements" className="text-slate-600 hover:text-slate-900">Announcements</a>
            <a href="/fees" className="text-slate-600 hover:text-slate-900">Fees</a>
          </div>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/reportcards" element={<ReportCards />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
