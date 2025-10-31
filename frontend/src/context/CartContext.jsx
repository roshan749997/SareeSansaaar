import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (saree) => {
    console.log('Adding to cart:', saree); // Debug log
    setCart(prevCart => {
      console.log('Previous cart state:', prevCart); // Debug log
      // Check if item already exists in cart
      const existingItem = prevCart.find(item => item.id === saree.id);
      
      let newCart;
      if (existingItem) {
        // If item exists, update quantity
        newCart = prevCart.map(item =>
          item.id === saree.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        newCart = [...prevCart, { ...saree, quantity: 1 }];
      }
      
      console.log('New cart state:', newCart); // Debug log
      return newCart;
    });
  };

  const removeFromCart = (sareeId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== sareeId));
  };

  const updateQuantity = (sareeId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(sareeId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === sareeId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + (item.price * (item.quantity || 1)),
    0
  );

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
