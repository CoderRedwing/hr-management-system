import { useEffect, useState } from 'react';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ from: '', to: '', reason: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const fetchLeaves = async () => {
    try {
      const endpoint = role === 'admin' ? 'http://localhost:3001/api/leaves' : 'http://localhost:3001/api/leaves/me';
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch leaves');
      setLeaves(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:3001/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Leave request failed');
      setSuccess('Leave requested successfully');
      setForm({ fromDate: '', toDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3001/api/leaves/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Status update failed');
      fetchLeaves();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>

      {role !== 'admin' && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Request Leave</h2>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {success && <div className="text-green-500 mb-2">{success}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">From</label>
              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">To</label>
              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block mb-1">Reason</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit Request
          </button>
        </form>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">
          {role === 'admin' ? 'All Leave Requests' : 'Your Leave History'}
        </h2>

        {role === 'admin' && (
          <input
            type="text"
            placeholder="Filter by employee name"
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            className="border px-3 py-2 mb-4 rounded w-full md:w-1/3"
          />
        )}

        {/* Employee view: full history */}
        {role !== 'admin' && (
          leaves.length === 0 ? (
            <p className="text-gray-600">No leave requests found.</p>
          ) : (
            <table className="w-full border text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">From</th>
                  <th className="p-2 border">To</th>
                  <th className="p-2 border">Reason</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td className="p-2 border">{leave.fromDate?.substring(0, 10)}</td>
                    <td className="p-2 border">{leave.toDate?.substring(0, 10)}</td>
                    <td className="p-2 border">{leave.reason}</td>
                    <td className="p-2 border capitalize">{leave.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {/* Admin view: Pending */}
        {role === 'admin' && (
          <>
            <h3 className="text-md font-semibold mt-4 mb-2">Pending Requests</h3>
            <table className="w-full border text-left mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Employee</th>
                  <th className="p-2 border">From</th>
                  <th className="p-2 border">To</th>
                  <th className="p-2 border">Reason</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves
                  .filter((leave) =>
                    leave.status === 'pending' &&
                    (filter ? leave.employee?.name?.toLowerCase().includes(filter) : true)
                  )
                  .map((leave) => (
                    <tr key={leave._id}>
                      <td className="p-2 border">
                        <div className="font-medium">{leave.employee?.name}</div>
                        <div className="text-sm text-gray-500">{leave.employee?.email}</div>
                      </td>
                      <td className="p-2 border">{leave.fromDate?.substring(0, 10)}</td>
                      <td className="p-2 border">{leave.toDate?.substring(0, 10)}</td>
                      <td className="p-2 border">{leave.reason}</td>
                      <td className="p-2 border capitalize">{leave.status}</td>
                      <td className="p-2 border space-x-2">
                        <button
                          onClick={() => handleStatusChange(leave._id, 'approved')}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(leave._id, 'rejected')}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Admin view: Processed */}
            <h3 className="text-md font-semibold mb-2">Processed Requests</h3>
            <table className="w-full border text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Employee</th>
                  <th className="p-2 border">From</th>
                  <th className="p-2 border">To</th>
                  <th className="p-2 border">Reason</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves
                  .filter((leave) =>
                    (leave.status === 'approved' || leave.status === 'rejected') &&
                    (filter ? leave.employee?.name?.toLowerCase().includes(filter) : true)
                  )
                  .map((leave) => (
                    <tr key={leave._id}>
                      <td className="p-2 border">
                        <div className="font-medium">{leave.employee?.name}</div>
                        <div className="text-sm text-gray-500">{leave.employee?.email}</div>
                      </td>
                      <td className="p-2 border">{leave.fromDate?.substring(0, 10)}</td>
                      <td className="p-2 border">{leave.toDate?.substring(0, 10)}</td>
                      <td className="p-2 border">{leave.reason}</td>
                      <td className="p-2 border capitalize">{leave.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaves;
