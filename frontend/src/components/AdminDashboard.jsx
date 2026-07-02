import { useState, useEffect } from 'react';
import api from '../api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await api.get('/api/admin/users');
        const gigsRes = await api.get('/api/admin/gigs');
        setUsers(usersRes.data);
        setGigs(gigsRes.data);
      } catch (err) {
        setError('Failed to fetch admin data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/admin/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user.');
        console.error(err);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => (user.id === userId ? res.data : user)));
    } catch (err) {
      setError('Failed to update user role.');
      console.error(err);
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      try {
        await api.delete(`/api/admin/gigs/${gigId}`);
        setGigs(gigs.filter(gig => gig.id !== gigId));
      } catch (err) {
        setError('Failed to delete gig.');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard card">
      <h2>Admin Dashboard</h2>
      
      <div className="card">
        <h3>Manage Users ({users.length})</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button onClick={() => handleDeleteUser(user.id)} className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Manage Gigs ({gigs.length})</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Owner ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gigs.map(gig => (
              <tr key={gig.id}>
                <td>{gig.id}</td>
                <td>{gig.title}</td>
                <td>{gig.owner_id}</td>
                <td>{gig.status}</td>
                <td>
                  <button onClick={() => handleDeleteGig(gig.id)} className="btn btn-danger">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;