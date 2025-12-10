import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Fixed price for all treatments
export const TREATMENT_PRICE = 1000000; // Rp 1,000,000

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (spa, treatment) => {
    const newItem = {
      id: Date.now(),
      spaId: spa.id,
      spaName: spa.title,
      spaLocation: spa.location,
      treatment,
      price: TREATMENT_PRICE,
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
    return cartItems.length > 0 && cartItems.every(item => item.date && item.time);
  };

  const getTotalPrice = () => {
    return cartItems.length * TREATMENT_PRICE;
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
