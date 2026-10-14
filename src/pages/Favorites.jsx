
import React from "react";
import { useFavorites } from "../context/FavoritesContext";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import "../index.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Favorites() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/products`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load products.");
        }

        const fetchedProducts = Array.isArray(data)
          ? data
          : data.products || [];

        const normalizedProducts = fetchedProducts.map((product) => ({
          ...product,
          id: String(product._id || product.id),
          img: product.images?.[0] || product.img || "",
        }));

        setProducts(normalizedProducts);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load favorites.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  const favoriteIds = new Set(
    favorites.map((id) => String(id))
  );

  const favoriteProducts = products.filter((product) =>
    favoriteIds.has(String(product.id))
  );

  return (
    <section className="mt-16 flex flex-col items-center justify-center bg-dark p-5 text-white">
      <div className="mb-3 flex w-full items-center justify-between">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 border border-gray/20 bg-transparent p-2 text-gray hover:text-white lg:bg-dark-soft"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <span className="border border-gray/20 p-2 text-sm text-gray">
          {favoriteProducts.length}{" "}
          {favoriteProducts.length === 1 ? "Favourite" : "Favourites"}
        </span>
      </div>

      <h1
        style={{ fontFamily: "AccentFont" }}
        className="mb-4 w-full bg-dark-soft p-4 text-center text-2xl"
      >
        Favorites
      </h1>

      {loading ? (
        <p className="py-12 text-gray">
          Loading your favorites...
        </p>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-red-400">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 border border-gray/20 p-2 hover:text-gray"
          >
            Try again
          </button>
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="py-12 text-center">
          <p>
            {products.length === 0
              ? "There are currently no products available."
              : "You haven't added any available products to your favorites yet."}
          </p>
        </div>
      ) : (
        <div className="products-grid grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7 lg:grid-cols-6">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
