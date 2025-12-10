import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart, getTotalPrice, formatPrice } = useCart();

  // Redirect to cart if cart is empty or incomplete
  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    const isComplete = cartItems.every(item => item.date && item.time);
    if (!isComplete) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleConfirmPayment = () => {
    alert('Payment functionality would be implemented here. For now, your booking is confirmed!');
    clearCart();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <h1 className="page-title">Payment & Booking Summary</h1>

        <div className="payment-container">
          <div className="payment-summary">
            <h2>Your Bookings</h2>
            {cartItems.map((item, index) => (
              <div key={item.id} className="payment-item">
                <div className="payment-item-number">Booking {index + 1}</div>
                <div className="payment-item-details">
                  <h3>{item.spaName}</h3>
                  <p className="payment-location">{item.spaLocation}, Bali</p>
                  <div className="payment-treatment">
                    <strong>Treatment:</strong> {item.treatment}
                  </div>
                  <div className="payment-price">
                    <strong>Price:</strong> {formatPrice(item.price)}
                  </div>
                  <div className="payment-datetime">
                    <div>
                      <strong>Date:</strong> {new Date(item.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div>
                      <strong>Time:</strong> {item.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="payment-info">
            <div className="info-box">
              <h3>Important Information</h3>
              <ul>
                <li>Please arrive 10-15 minutes before your appointment</li>
                <li>Cancellations must be made at least 24 hours in advance</li>
                <li>Bring a valid ID for verification</li>
                <li>You will receive a confirmation email after payment</li>
              </ul>
            </div>

            <div className="payment-total">
              <h3>Total Bookings: {cartItems.length}</h3>
              <div style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>
                Total: {formatPrice(getTotalPrice())}
              </div>
              <p className="note" style={{ marginTop: '1rem' }}>
                Payment to be made at the spa
              </p>
            </div>
          </div>
        </div>

        <div className="payment-actions">
          <button className="button-secondary" onClick={() => navigate('/cart')}>
            ← Back to Cart
          </button>
          <button className="button-primary" onClick={handleConfirmPayment}>
            Confirm Payment
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
