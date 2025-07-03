// File: src/pages/Announcements.jsx
import { useEffect, useState } from 'react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/announcements', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAnnouncements(data || []);
      } else {
        setError(data.message || 'Failed to fetch announcements');
      }
    } catch {
      setError('Network error while fetching announcements');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to post announcement');
        return;
      }
      setForm({ title: '', content: '' });
      setMessage('Announcement posted successfully');
      fetchAnnouncements();
    } catch {
      setError('Network error while posting announcement');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>

      {/* Post Form (Admin only) */}
      {role === 'admin' && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Post New Announcement</h2>
          {message && <div className="mb-2 text-green-600 font-medium">{message}</div>}
          {error && <div className="mb-2 text-red-600 font-medium">{error}</div>}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Post Announcement
          </button>
        </form>
      )}

      {/* View Announcements */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">All Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements yet.</p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((a) => (
              <li key={a._id} className="border p-4 rounded bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800">{a.title}</h3>
                <p className="text-gray-700 mt-1 whitespace-pre-line">{a.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted on: {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Announcements;
