import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateCartItem,
    isCartComplete,
    getTotalPrice,
    formatPrice,
    userInfo,
    updateUserInfo,
    isValidEmail,
    isValidPhone,
  } = useCart();

  const handleDateChange = (itemId, date) => {
    updateCartItem(itemId, { date });
  };

  const handleTimeChange = (itemId, time) => {
    updateCartItem(itemId, { time });
  };

  const handleQuantityChange = (itemId, quantity) => {
    updateCartItem(itemId, { quantity: parseInt(quantity) });
  };

  const handleDelete = (itemId) => {
    if (confirm('Remove this item from cart?')) {
      removeFromCart(itemId);
    }
  };

  const handleProceedToPayment = () => {
    if (isCartComplete()) {
      navigate('/payment');
    }
  };

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  if (cartItems.length === 0) {
    return (
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <div className="empty-cart">
            <h1 className="page-title">Your Cart</h1>
            <p>Your cart is empty. Browse spas and add treatments to get started!</p>
            <button className="button-primary" onClick={() => navigate('/')}>
              Browse Spas
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <h1 className="page-title">Your Cart</h1>

        <div className="cart-container">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-header">
                <div>
                  <h3 className="cart-item-spa">{item.spaName}</h3>
                  <p className="cart-item-location">{item.spaLocation}</p>
                  <p className="cart-item-treatment">{item.treatment}</p>
                  <p className="cart-item-price">
                    {formatPrice(item.price)} per package
                    {item.quantity > 1 && (
                      <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
                        | Subtotal: {formatPrice(item.price * item.quantity)}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item.id)}
                  title="Remove from cart"
                >
                  🗑️
                </button>
              </div>

              <div className="cart-item-inputs">
                <div className="input-group">
                  <label htmlFor={`quantity-${item.id}`}>
                    Number of Packages <span className="required">*</span>
                  </label>
                  <select
                    id={`quantity-${item.id}`}
                    value={item.quantity || 1}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="quantity-select"
                    required
                  >
                    <option value="1">1 Package</option>
                    <option value="2">2 Packages</option>
                    <option value="3">3 Packages</option>
                    <option value="4">4 Packages</option>
                    <option value="5">5 Packages</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor={`date-${item.id}`}>
                    Date <span className="required">*</span>
                  </label>
                  <input
                    id={`date-${item.id}`}
                    type="date"
                    value={item.date}
                    min={minDate}
                    onChange={(e) => handleDateChange(item.id, e.target.value)}
                    className="date-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor={`time-${item.id}`}>
                    Time <span className="required">*</span>
                  </label>
                  <select
                    id={`time-${item.id}`}
                    value={item.time}
                    onChange={(e) => handleTimeChange(item.id, e.target.value)}
                    className="time-select"
                    required
                  >
                    <option value="">Select time...</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(!item.date || !item.time) && (
                <div className="validation-message">
                  Please select both date and time to proceed
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Information Form */}
        <div className="user-info-section">
          <h2 className="section-title">Your Information</h2>
          <p className="section-description">Please fill in your details to complete the booking</p>

          <div className="user-info-form">
            <div className="input-group">
              <label htmlFor="user-name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="user-name"
                type="text"
                value={userInfo.name}
                onChange={(e) => updateUserInfo('name', e.target.value)}
                className="text-input"
                placeholder="Enter your full name"
                required
              />
              {!userInfo.name && (
                <div className="validation-message-inline">Name is required</div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="user-email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="user-email"
                type="email"
                value={userInfo.email}
                onChange={(e) => updateUserInfo('email', e.target.value)}
                className="text-input"
                placeholder="your.email@example.com"
                required
              />
              {userInfo.email && !isValidEmail(userInfo.email) && (
                <div className="validation-message-inline error">Please enter a valid email address</div>
              )}
              {!userInfo.email && (
                <div className="validation-message-inline">Email is required</div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="user-phone">
                Phone Number <span className="required">*</span>
              </label>
              <input
                id="user-phone"
                type="tel"
                value={userInfo.phone}
                onChange={(e) => updateUserInfo('phone', e.target.value)}
                className="text-input"
                placeholder="+1234567890 or 08123456789"
                required
              />
              {userInfo.phone && !isValidPhone(userInfo.phone) && (
                <div className="validation-message-inline error">
                  Please enter a valid phone number (7-15 digits, with optional country code)
                </div>
              )}
              {!userInfo.phone && (
                <div className="validation-message-inline">Phone number is required</div>
              )}
            </div>
          </div>
        </div>

        <div className="cart-footer">
          <div>
            <p className="cart-summary">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
            </p>
            <p className="cart-total">
              <strong>Total: {formatPrice(getTotalPrice())}</strong>
            </p>
          </div>
          <button
            className={`button-payment ${isCartComplete() ? 'active' : 'disabled'}`}
            onClick={handleProceedToPayment}
            disabled={!isCartComplete()}
          >
            {isCartComplete() ? 'Proceed to Payment' : 'Complete All Details to Continue'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
