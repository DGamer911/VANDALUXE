
import { useEffect, useState } from "react";
import "../index.css";
import { NavLink } from "react-router-dom";
import model from "../assets/vdx9.jpeg";
import placeholder from "../assets/vdx13.jpeg";
import { motion } from "motion/react";
import { Search, ListFilterIcon } from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function Shop() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(
          "We couldn't load the collection. Please check your connection and try again."
        );
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    model: {
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${model})`,
    },
  };

  const ProductCard = ({ product, featured = false }) => (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, type: "spring" }}
      className={`cursor-pointer flex flex-none flex-col items-center justify-between relative bg-dark-soft ${
        featured
          ? "mb-10 p-2 max-w-[220px]"
          : "max-w-[135px] lg:max-w-[200px]"
      }`}
    >
      <NavLink
        className="w-full flex flex-col items-center justify-center"
        to={`/products/${product._id}`}
      >
        <motion.img
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
          className={featured ? "" : "rounded-b-2xl"}
          src={product.images?.[0] || placeholder}
          alt={product.name}
        />

        {featured ? (
          <div className="bg-dark-soft translate-y-5 absolute bottom-0 px-4 py-2 flex flex-col">
            <span>{product.name}</span>
            <span>₦{product.price.toLocaleString("en-NG")}</span>
          </div>
        ) : (
          <div className="flex flex-col p-3 gap-[1px] w-full">
            <span className="text-center">{product.name}</span>
            <span className="text-center font-light">
              ₦{product.price.toLocaleString("en-NG")}
            </span>
            <span className="text-center text-sm font-light">
              {product.stock > 0 ? "In stock" : "Currently unavailable"}
            </span>
            <span className="bg-white w-full p-2 text-dark text-center">
              View Product
            </span>
          </div>
        )}
      </NavLink>
    </motion.div>
  );

  return (
    <div className="flex homePage bg-dark flex-col items-center overflow-x-hidden text-white justify-center w-full h-full">
      <section
        style={styles.model}
        className="p-5 relative flex flex-col items-center lg:bg-dark justify-center lg:bg-contain w-full h-screen bg-hero bg-cover bg-center"
      >
        <div className="storeBanner flex justify-between items-center absolute p-2 top-12 w-full h-[100px]">
          <span className="font-sm cursor-pointer border border-white-soft text-white-soft p-2 font-thin">
            <NavLink className="font-sm hover:underline" to="/"> 
              Home
            </NavLink>
            {" / "}Shop
          </span>
        </div>

        <div className="flex flex-col w-full items-center justify-center gap-2">
          <h1
            style={{ fontFamily: "AccentFont" }}
            className="font-bold text-white text-4xl uppercase"
          >
            Shop
          </h1>

          <p className="text-center max-w-[400px] font-light">
            Discover the Vandaluxe collection. Find your style and make your
            statement.
          </p>

          <a
            href="/#contact"
            className="bg-transparent text-white uppercase text-center border border-white hover:text-dark hover:bg-white rounded-full py-3 px-1 transition-all duration-300 ease-out w-full max-w-[320px]"
          >
            Join the rebellion
          </a>
        </div>
      </section>

      <section className="relative w-full text-center flex flex-col items-center">
        <h1
          className="bg-dark-soft translate-y-[-50%] p-4 w-[40%] text-white text-center"
          style={{ fontFamily: "Castoro titling" }}
        >
          Collection
        </h1>

        {loading ? (
          <p className="py-8 text-white-soft">Loading collection...</p>
        ) : error ? (
          <p className="py-8 px-4 text-red-400">{error}</p>
        ) : products.length === 0 ? (
          <p className="py-8 text-white-soft">
            No products are available right now.
          </p>
        ) : (
          <div className="w-full justify-center items-center flex flex-nowrap overflow-x-auto cardScroll scroll-smooth gap-4 py-2 px-6 mt-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} featured />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-gray/20 p-5 w-full flex flex-col items-center">
        <div className="w-full mb-4 gap-2 flex">
          <button
            type="button"
            aria-label="Product filters"
            className="border-gray/20 border text-gray/50 p-2"
          >
            <ListFilterIcon />
          </button>

          <input
            className="p-2 flex-1 min-w-0 outline-0 border-gray/20 border bg-transparent text-white"
            placeholder="Search products"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button
            type="button"
            aria-label="Search products"
            className="border-gray/20 border text-gray/50 p-2"
          >
            <Search />
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-white-soft">Loading products...</p>
        ) : error ? (
          <p className="py-8 px-4 text-red-400">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="py-8 text-white-soft">
            No matching products found.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Shop;
