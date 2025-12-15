import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles.css';

const MyAccountPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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

  const goToHome = () => {
    navigate('/');
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="my-account-page">
      <div className="account-container">
        <div className="account-card">
          <h1>My Account</h1>
          <p className="account-subtitle">Welcome back, {user.name}!</p>

          <div className="account-info">
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
              <span className="info-value">{user.role}</span>
            </div>
          </div>

          <div className="account-actions">
            <button onClick={goToHome} className="btn btn-primary">
              Go to Bali Spa Guide
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
