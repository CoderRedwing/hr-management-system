import { useEffect, useState } from 'react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    department: '',
    designation: '',
    phone: '',
    joinDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/admin/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch employees');
      setEmployees(data.employees || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create employee');
      setForm({
        username: '',
        password: '',
        name: '',
        email: '',
        department: '',
        designation: '',
        phone: '',
        joinDate: '',
      });
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {showForm ? 'Cancel' : 'Add Employee'}
      </button>

      {showForm && (
        <form onSubmit={handleAddEmployee} className="bg-white p-4 rounded shadow mb-6 space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <div className="grid md:grid-cols-2 gap-4">
            <input name="username" placeholder="Username" onChange={handleChange} required className="border p-2 rounded" />
            <input name="password" placeholder="Password" type="password" onChange={handleChange} required className="border p-2 rounded" />
            <input name="name" placeholder="Full Name" onChange={handleChange} required className="border p-2 rounded" />
            <input name="email" placeholder="Email" type="email" onChange={handleChange} required className="border p-2 rounded" />
            <input name="department" placeholder="Department ID" onChange={handleChange} required className="border p-2 rounded" />
            <input name="designation" placeholder="Designation" onChange={handleChange} className="border p-2 rounded" />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} className="border p-2 rounded" />
            <input name="joinDate" placeholder="Join Date (YYYY-MM-DD)" onChange={handleChange} className="border p-2 rounded" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Save Employee
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-gray-600">Loading employees...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <p className="mb-4 text-gray-700">
            Total Employees: <strong>{employees.length}</strong>
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Department</th>
                  <th className="p-2 border">Designation</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id} className="border-t hover:bg-gray-50">
                    <td className="p-2 border">{emp.name}</td>
                    <td className="p-2 border">{emp.email}</td>
                    <td className="p-2 border">{emp.department?.name || 'N/A'}</td>
                    <td className="p-2 border">{emp.designation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
