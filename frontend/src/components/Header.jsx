// frontend/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Header() {
  const { cartItems } = useCart();

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
        <div className="app-header-tagline">
          Discover and compare spas across Bali.
        </div>
      </div>
    </header>
  );
}
