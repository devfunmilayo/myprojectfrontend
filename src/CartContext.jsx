import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // ── Add item ───────────────────────────────────────────────────────────────
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  // ── Remove item ────────────────────────────────────────────────────────────
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // ── Toggle — adds if not in cart, removes if already in cart ──────────────
  // This is what the Add/Remove button uses
  const toggleCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  // ── Check if a product is already in cart ─────────────────────────────────
  const isInCart = (productId) => cartItems.some((item) => item.id === productId);

  // ── Clear entire cart ──────────────────────────────────────────────────────
  const clearCart = () => setCartItems([]);

  // ── Total + count ──────────────────────────────────────────────────────────
  const cartTotal = cartItems.reduce((sum, item) => sum + item.priceNum, 0);
  const cartCount = cartItems.length;

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart,
      toggleCart, isInCart,
      clearCart, cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);