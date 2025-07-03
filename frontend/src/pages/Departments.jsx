// File: src/pages/Departments.jsx
import { useEffect, useState } from 'react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState('');
  const [editDept, setEditDept] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchDepartments = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/departments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      setDepartments(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newDept }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNewDept('');
      setMessage('Created successfully');
      fetchDepartments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/departments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editDept.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEditDept(null);
      setMessage('Updated successfully');
      fetchDepartments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/departments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage('Deleted successfully');
      fetchDepartments();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-4">Manage Departments</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Create New Department</h2>
        {message && <div className="text-green-600 mb-2">{message}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex gap-2">
          <input
            type="text"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            placeholder="Enter department name"
            className="border px-3 py-2 rounded w-full"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add
          </button>
        </div>
      </form>

      {/* List of Departments */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Existing Departments</h2>
        {departments.length === 0 ? (
          <p className="text-gray-600">No departments available.</p>
        ) : (
          <ul className="divide-y">
            {departments.map((dept) => (
              <li key={dept._id} className="py-2 flex justify-between items-center">
                {editDept && editDept._id === dept._id ? (
                  <>
                    <input
                      type="text"
                      value={editDept.name}
                      onChange={(e) => setEditDept({ ...editDept, name: e.target.value })}
                      className="border px-2 py-1 rounded w-full mr-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(dept._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditDept(null)}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-gray-800">{dept.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditDept(dept)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dept._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Departments;
