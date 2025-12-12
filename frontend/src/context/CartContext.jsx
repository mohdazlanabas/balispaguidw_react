import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Fixed price for all treatments
export const TREATMENT_PRICE = 150000; // Rp 150,000

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : { name: '', email: '', phone: '' };
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  const addToCart = (spa, treatment) => {
    const newItem = {
      id: Date.now(),
      spaId: spa.id,
      spaName: spa.title,
      spaLocation: spa.location,
      treatment,
      price: TREATMENT_PRICE,
      quantity: 1, // Default quantity
      date: '',
      time: '',
    };
    setCartItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItem = (itemId, updates) => {
    setCartItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, ...updates } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isCartComplete = () => {
    const itemsComplete = cartItems.length > 0 && cartItems.every(item => item.date && item.time && item.quantity);
    const userInfoComplete = userInfo.name && userInfo.email && userInfo.phone;
    return itemsComplete && userInfoComplete && isValidEmail(userInfo.email) && isValidPhone(userInfo.phone);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const updateUserInfo = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    // International phone number: accepts all formats with 7-15 digits
    // Removes spaces, dashes, parentheses, and dots for validation
    const cleaned = phone.replace(/[\s\-().]/g, '');
    // Must start with + or digit, and contain 7-15 digits total
    const phoneRegex = /^[\+]?[0-9]{7,15}$/;
    return phoneRegex.test(cleaned);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        isCartComplete,
        getTotalPrice,
        formatPrice,
        TREATMENT_PRICE,
        userInfo,
        updateUserInfo,
        isValidEmail,
        isValidPhone,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
