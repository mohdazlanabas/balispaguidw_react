// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import HomePage from './pages/HomePage.jsx';
import LocationPage from './pages/LocationPage.jsx';
import TreatmentPage from './pages/TreatmentPage.jsx';
import CartPage from './pages/CartPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import StripePaymentPage from './pages/StripePaymentPage.jsx';
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import MyAccountPage from './pages/MyAccountPage.jsx';
import SpaOwnerPage from './pages/SpaOwnerPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/locations" element={<LocationPage />} />
          <Route path="/locations/:location" element={<LocationPage />} />
          <Route path="/treatments" element={<TreatmentPage />} />
          <Route path="/treatments/:treatment" element={<TreatmentPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/stripe-payment" element={<StripePaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<MyAccountPage />} />
          <Route path="/spa-owner" element={<SpaOwnerPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
