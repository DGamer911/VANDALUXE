
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const FavoritesContext = createContext();

function loadFavorites() {
  try {
    const savedFavorites = localStorage.getItem("favorites");
    const parsed = savedFavorites ? JSON.parse(savedFavorites) : [];

    return Array.isArray(parsed)
      ? parsed.map(String)
      : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    const id = String(productId);

    setFavorites((currentFavorites) => {
      if (currentFavorites.includes(id)) {
        return currentFavorites.filter(
          (favoriteId) => favoriteId !== id
        );
      }

      return [...currentFavorites, id];
    });
  };

  const isFavorite = (productId) => {
    return favorites.includes(String(productId));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
