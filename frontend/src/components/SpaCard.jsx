// frontend/src/components/SpaCard.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

function budgetToSymbols(budget) {
  if (!budget) return '–';
  return '$'.repeat(budget);
}

export default function SpaCard({ spa }) {
  const { addToCart } = useCart();
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const timeLabel =
    spa.opening_hour && spa.closing_hour
      ? `${spa.opening_hour} – ${spa.closing_hour}`
      : '';

  const handleAddToCart = () => {
    if (!selectedTreatment) {
      alert('Please select a treatment first');
      return;
    }
    addToCart(spa, selectedTreatment);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedTreatment('');
    }, 2000);
  };

  return (
    <article className="spa-card">
      <div>
        <div className="spa-card-title">{spa.title}</div>
        {spa.location && (
          <div className="spa-card-location">{spa.location}, Bali</div>
        )}
        {spa.address && (
          <div className="spa-card-address">{spa.address}</div>
        )}
        <div className="spa-card-meta">
          {spa.rating != null && (
            <span className="badge badge-rating">
              ★ {spa.rating.toFixed(1)}
            </span>
          )}
          {spa.budget != null && (
            <span className="badge badge-budget">
              Budget: {budgetToSymbols(spa.budget)}
            </span>
          )}
          {timeLabel && <span className="badge badge-time">{timeLabel}</span>}
        </div>
        {/* All Treatments */}
        {spa.treatments.length > 0 && (
          <div className="treatments-list">
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>
              Available Treatments (Rp 1,000,000 each):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {spa.treatments.map((treatment) => (
                <span key={treatment} className="treatment-badge">
                  {treatment}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Treatment Selection */}
        {spa.treatments.length > 0 && (
          <div style={{ marginTop: '0.75rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Select Treatment:
            </label>
            <select
              value={selectedTreatment}
              onChange={(e) => setSelectedTreatment(e.target.value)}
              className="treatment-select"
              style={{ width: '100%', padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1' }}
            >
              <option value="">Choose a treatment...</option>
              {spa.treatments.map((treatment) => (
                <option key={treatment} value={treatment}>
                  {treatment}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="spa-card-actions">
        {spa.phone && <div>☎ {spa.phone}</div>}
        {spa.email && <div>✉ {spa.email}</div>}
        {spa.website && (
          <a href={spa.website} target="_blank" rel="noreferrer">
            Visit website →
          </a>
        )}
        <button
          className="button-cart"
          onClick={handleAddToCart}
          disabled={!selectedTreatment}
        >
          {showSuccess ? '✓ Added!' : '🛒 Add to Cart'}
        </button>
      </div>
    </article>
  );
}
