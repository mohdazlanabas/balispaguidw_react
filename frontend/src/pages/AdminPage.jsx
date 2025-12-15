import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import '../styles.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);

      // Check if user is admin
      if (userData.role !== 'admin') {
        // If not admin, redirect to appropriate page
        if (userData.role === 'spa_owner') {
          navigate('/spa-owner');
        } else {
          navigate('/account');
        }
        return;
      }

      setUser(userData);
      fetchAllUsers();
    } else {
      // If no user, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="admin-page">
      <Header />

      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Manage users and system settings</p>
        </div>

        <div className="admin-content">
          <div className="admin-section">
            <h2>Registered Users</h2>

            {loading ? (
              <div className="loading-state">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="empty-state">No users found</div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || 'Not set'}</td>
                        <td>
                          <span className={`role-badge role-${u.role}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${u.is_active ? 'active' : 'inactive'}`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="admin-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="stat-value">{users.length}</div>
            </div>
            <div className="stat-card">
              <h3>Spa Owners</h3>
              <div className="stat-value">
                {users.filter(u => u.role === 'spa_owner').length}
              </div>
            </div>
            <div className="stat-card">
              <h3>Regular Users</h3>
              <div className="stat-value">
                {users.filter(u => u.role === 'user').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
