// File: src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!role) return null; // hide navbar if not logged in

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-blue-700">HRMS</h1>
        <Link to="/dashboard" className="text-sm text-gray-700 hover:underline">Dashboard</Link>
        {role === 'admin' && (
          <>
            <Link to="/employees" className="text-sm text-gray-700 hover:underline">Employees</Link>
            <Link to="/departments" className="text-sm text-gray-700 hover:underline">Departments</Link>
          </>
        )}
        <Link to="/leaves" className="text-sm text-gray-700 hover:underline">Leaves</Link>
        <Link to="/attendance" className="text-sm text-gray-700 hover:underline">Attendance</Link>
        <Link to="/announcements" className="text-sm text-gray-700 hover:underline">Announcements</Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">👋 {username}</span>
        <button onClick={logout} className="text-sm text-red-600 hover:underline">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
