import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles.css';

const SpaOwnerPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      
      // Check if user is a spa_owner
      if (userData.role !== 'spa_owner') {
        // If not spa owner, redirect to appropriate page
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
        return;
      }
      
      setUser(userData);
    } else {
      // If no user, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to home
    navigate('/');
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="spa-owner-page">
      <div className="spa-owner-container">
        <div className="spa-owner-card">
          <div className="spa-owner-header">
            <h1>Spa Owner Dashboard</h1>
            <p className="spa-owner-subtitle">Welcome, {user.name}!</p>
          </div>

          <div className="spa-owner-info">
            <div className="info-section">
              <h3>Account Information</h3>
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{user.phone || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role:</span>
                <span className="info-value badge-owner">Spa Owner</span>
              </div>
            </div>

            <div className="info-section coming-soon">
              <h3>Coming Soon</h3>
              <ul className="feature-list">
                <li>📊 View your spa's bookings</li>
                <li>📅 Manage availability calendar</li>
                <li>💰 Track revenue and payments</li>
                <li>⭐ View customer reviews</li>
                <li>✏️ Edit spa information</li>
                <li>📸 Upload spa photos</li>
              </ul>
            </div>
          </div>

          <div className="spa-owner-actions">
            <button onClick={handleLogout} className="btn btn-logout-full">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaOwnerPage;
