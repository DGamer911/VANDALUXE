
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, quantity = 1) => {
    // Support both MongoDB products and older static products.
    const productId = product._id || product.id;

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) =>
          String(item.productId) === String(productId) &&
          item.size === size
      );

      if (existingItem) {
        return currentCart.map((item) =>
          String(item.productId) === String(productId) &&
          item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...currentCart,
        {
          productId,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.img || "",
          size,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId, size) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            String(item.productId) === String(productId) &&
            item.size === size
          )
      )
    );
  };

  const increaseQuantity = (productId, size) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        String(item.productId) === String(productId) &&
        item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId, size) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          String(item.productId) === String(productId) &&
          item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
