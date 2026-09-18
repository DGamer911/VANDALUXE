import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add a product to the cart
  const addToCart = (product, size, quantity = 1) => {
    setCart((currentCart) => {
      // Check if the exact product + size already exists
      const existingItem = currentCart.find(
        (item) => item.productId === product.id && item.size === size
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.productId === product.id && item.size === size
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.img,
          size,
          quantity,
        },
      ];
    });
  };

  // Remove an item completely
  const removeFromCart = (productId, size) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  };

  // Increase quantity
  const increaseQuantity = (productId, size) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.productId === productId && item.size === size
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (productId, size) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.productId === productId && item.size === size
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Empty the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Number of individual items in cart
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total price
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
