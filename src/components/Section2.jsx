
import React from "react";
import "../index.css";
import { motion } from "motion/react";
import { Link, NavLink } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Section2() {
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

        setProducts(fetchedProducts);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load products.");
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

  return (
    <section className="flex h-full w-full flex-col items-center justify-center bg-white p-8">
      <h1
        style={{ fontFamily: "Castoro titling" }}
        className="text-center uppercase"
      >
        Try Out Our Latest Selection
      </h1>

      <div className="cardScroll mt-6 flex w-full flex-nowrap items-center justify-center gap-4 overflow-x-auto scroll-smooth">
        {loading ? (
          <p className="py-12 text-center text-gray-500">
            Loading the latest collection...
          </p>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 border border-black px-4 py-2 text-sm"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No products are available right now.
          </p>
        ) : (
          products.map((item) => {
            const productId = item._id || item.id;
            const image =
              item.images?.[0] || item.img || "";

            return (
              <motion.div
                key={productId}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3, type: "spring" }}
                className="relative mb-10 flex max-w-[220px] flex-none cursor-pointer flex-col items-center justify-between bg-white-soft p-2 hover:shadow-2xl"
              >
                <NavLink
                  className="flex w-full flex-col items-center justify-center"
                  to={`/products/${productId}`}
                >
                  {image ? (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-full object-cover"
                      src={image}
                      alt={item.name || "Vandaluxe product"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
                      No image available
                    </div>
                  )}

                  <div className="absolute bottom-0 flex translate-y-5 flex-col bg-white-soft px-4 py-2 text-center">
                    <span>{item.name}</span>
                    <span>
                      ₦{Number(item.price || 0).toLocaleString("en-NG")}
                    </span>
                  </div>
                </NavLink>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-8 flex w-full flex-col items-center justify-center space-y-2 border-t-2 border-white-soft p-2 text-center">
        <p className="font-light lg:my-2">
          Built different. Worn unapologetically. Explore the latest pieces
          from Vandaluxe.
        </p>

        <Link to="/Collection" className="w-full">
          <motion.button
            type="button"
            style={{ border: "1px solid transparent" }}
            whileHover={{
              background: "transparent",
              color: "black",
              border: "1px solid #1C1C1C",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-[300px] bg-dark p-4 text-white"
          >
            View More
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

export default Section2;
