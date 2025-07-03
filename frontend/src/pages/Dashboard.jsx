import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('username');
    if (!userRole) return navigate('/login');
    setRole(userRole);
    setUsername(userName || '');
  }, []);

  const handleNavigate = (path) => navigate(path);

  const adminOptions = [
    { title: 'Manage Employees', path: '/employees' },
    { title: 'Manage Departments', path: '/departments' },
    { title: 'Manage Leaves', path: '/leaves' },
    { title: 'Attendance Records', path: '/attendance' },
    { title: 'Announcements', path: '/announcements' },
  ];

  const employeeOptions = [
    { title: 'My Leaves', path: '/leaves' },
    { title: 'My Attendance', path: '/attendance' },
    { title: 'Company Announcements', path: '/announcements' },
  ];

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <p className="text-gray-700 text-lg">
          Welcome, <span className="font-semibold capitalize">{username}</span>!
        </p>
        <p className="text-sm text-gray-500 mt-1 capitalize">
          Logged in as: <strong>{role}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(role === 'admin' ? adminOptions : employeeOptions).map(({ title, path }) => (
          <div
            key={title}
            onClick={() => handleNavigate(path)}
            className={`cursor-pointer p-6 rounded shadow transition
              ${role === 'admin' ? 'bg-blue-100 hover:bg-blue-200' : 'bg-green-100 hover:bg-green-200'}`}
          >
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">Go to {title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
