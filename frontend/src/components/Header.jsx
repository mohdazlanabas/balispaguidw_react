// frontend/src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Header() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Update state
    setUser(null);

    // Redirect to home
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const goToAccount = () => {
    if (user) {
      if (user.role === 'spa_owner') {
        navigate('/spa-owner');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    }
  };

  return (
    <header className="app-header">
      <Link to="/" className="app-logo">Bali Spa Directory</Link>
      <nav className="app-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/locations" className="nav-link">Locations</Link>
        <Link to="/treatments" className="nav-link">Treatments</Link>
        <Link to="/cart" className="nav-link cart-link">
          🛒 Cart
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </Link>
      </nav>
      <div className="app-header-right">
        {user ? (
          <div className="header-auth-section">
            <div className="user-info-compact" onClick={goToAccount}>
              <span className="user-name">{user.name}</span>
              <span className={`user-role-badge role-${user.role}`}>{user.role}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className="btn-login">
            Login
          </button>
        )}
      </div>
    </header>
  );
}
