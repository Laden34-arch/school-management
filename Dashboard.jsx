import { Link } from 'react-router-dom';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.firstName || 'Teacher'} </h1>
          <p className="text-sm text-slate-600">Role: {user.role || 'N/A'}</p>
        </div>
        <button className="py-2 px-4 bg-red-600 text-white rounded" onClick={logout}>Logout</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/students" className="p-4 bg-white rounded shadow hover:border-blue-500 border">Student Management</Link>
        <Link to="/assessments" className="p-4 bg-white rounded shadow hover:border-blue-500 border">Assessments</Link>
        <div className="p-4 bg-white rounded shadow border">Attendance and Fees dashboards in progress</div>
      </div>
    </div>
  );
}
