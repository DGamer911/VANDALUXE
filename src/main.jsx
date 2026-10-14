import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext.jsx";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <CartProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
