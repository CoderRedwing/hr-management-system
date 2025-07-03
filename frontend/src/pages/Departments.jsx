    import { useEffect, useState } from 'react';

    const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
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

    const fetchEmployeesByDepartment = async (deptId) => {
        try {
        setSelectedDept(deptId);
        const res = await fetch(`http://localhost:3001/api/admin/employees/by-department?department=${deptId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch employees');
        setEmployees(data || []);
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

                if (!res.ok) {
                    // Try to get error message if possible
                    const data = await res.json().catch(() => null);
                    throw new Error(data?.message || 'Failed to delete department');
                }

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

        {/* Create Department */}
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

        {/* Department List */}
        <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">Departments</h2>
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
                        <div className="cursor-pointer w-full" onClick={() => fetchEmployeesByDepartment(dept._id)}>
                        <div className="text-gray-800 font-medium">{dept.name}</div>
                        <div className="text-sm text-gray-500">ID: {dept._id}</div>
                        </div>
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

        {/* Employees in Department */}
        {selectedDept && (
            <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">Employees in Selected Department</h2>
            {employees.length === 0 ? (
                <p className="text-gray-600">No employees found in this department.</p>
            ) : (
                <ul className="divide-y">
                {employees.map((emp) => (
                    <li key={emp._id} className="py-2">
                    <div className="font-medium">{emp.name}</div>
                    <div className="text-sm text-gray-600">{emp.email}</div>
                    </li>
                ))}
                </ul>
            )}
            </div>
        )}
        </div>
    );
    };

    export default Departments;
