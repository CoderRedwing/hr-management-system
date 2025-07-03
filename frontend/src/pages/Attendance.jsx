// File: src/pages/Attendance.jsx
import { useEffect, useState } from 'react';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const fetchAttendance = async () => {
    try {
      const endpoint =
        role === 'admin'
          ? 'http://localhost:3001/api/attendance' // admin: all employees
          : 'http://localhost:3001/api/attendance/me'; // employee: self

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        const records = data.attendance || data;
        setAttendance(records);

        if (role !== 'admin') {
          const today = new Date().toISOString().substring(0, 10);
          const todayRecord = records.find((a) => a.date?.startsWith(today));
          if (todayRecord?.checkIn && !todayRecord?.checkOut) setStatus('checked-in');
          else if (todayRecord?.checkIn && todayRecord?.checkOut) setStatus('checked-out');
          else setStatus('');
        }
      }
    } catch (err) {
      console.error('Failed to fetch attendance');
    }
  };

  const handleAction = async (type) => {
    try {
      const res = await fetch(`http://localhost:3001/api/attendance/${type}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`${type === 'check-in' ? 'Checked in' : 'Checked out'} successfully`);
        fetchAttendance();
      } else {
        setMessage(data.message || 'Action failed');
      }
    } catch (err) {
      setMessage('Network error');
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredAttendance = role === 'admin'
    ? attendance.filter((a) =>
        a.employee?.name?.toLowerCase().includes(filter.toLowerCase())
      )
    : attendance;

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>

      {/* Check-In/Out Buttons - Employees only */}
      {role !== 'admin' && (
        <div className="bg-white p-4 rounded shadow mb-6">
          {message && <div className="mb-4 text-blue-600 font-medium">{message}</div>}
          <div className="flex gap-4">
            <button
              onClick={() => handleAction('check-in')}
              disabled={status === 'checked-in' || status === 'checked-out'}
              className={`px-4 py-2 rounded ${
                status === 'checked-in' || status === 'checked-out'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Check In
            </button>
            <button
              onClick={() => handleAction('check-out')}
              disabled={status !== 'checked-in'}
              className={`px-4 py-2 rounded ${
                status !== 'checked-in'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Check Out
            </button>
          </div>
        </div>
      )}

      {/* Filter - Admin only */}
      {role === 'admin' && (
        <input
          type="text"
          placeholder="Filter by employee name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 mb-4 rounded w-full md:w-1/3"
        />
      )}

      {/* Attendance Records */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">
          {role === 'admin' ? 'All Attendance Records' : 'Your Attendance Records'}
        </h2>

        {filteredAttendance.length === 0 ? (
          <p className="text-gray-600">No attendance records found.</p>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                {role === 'admin' && <th className="p-2 border">Employee</th>}
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Check In</th>
                <th className="p-2 border">Check Out</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((a) => (
                <tr key={a._id}>
                  {role === 'admin' && (
                    <td className="p-2 border">{a.employee?.name || 'Unknown'}</td>
                  )}
                  <td className="p-2 border">{a.date?.substring(0, 10)}</td>
                  <td className="p-2 border">{a.checkIn?.substring(11, 19) || '-'}</td>
                  <td className="p-2 border">{a.checkOut?.substring(11, 19) || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
