
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import cartIconData from "../assets/InBag.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import placeholder from "../assets/vdx13.jpeg";
import "../index.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");



function RecommendedProducts({ currentProductId, currentCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to load products");

        const data = await response.json();

        const allProducts = Array.isArray(data)
          ? data
          : data.products || [];

        const activeProducts = allProducts.filter(
          (item) =>
            item._id !== currentProductId &&
            item.isActive !== false
        );

        const sameCategory = currentCategory
          ? activeProducts.filter(
              (item) => item.category === currentCategory
            )
          : [];

        const recommendations = [
          ...sameCategory,
          ...activeProducts.filter(
            (item) => !sameCategory.some(
              (recommended) => recommended._id === item._id
            )
          ),
        ];

        setProducts(recommendations.slice(0, 4));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Recommended products error:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [currentProductId, currentCategory]);

  

  return (
    <aside className="w-full lg:w-[300px] lg:shrink-0 bg-dark-soft p-4 mt-2">
      <div className="border-b border-gray/20 pb-4 flex items-center justify-between">
        <h2 className="uppercase text-white text-sm tracking-wider">
          You may also like
        </h2>
        <span className="text-gray text-xs">DISCOVER</span>
      </div>

      <p className="text-gray text-xs font-light mt-3 mb-4">
        More pieces worth adding to your collection.
      </p>

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="min-w-0 flex-1 h-40 bg-dark animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray text-sm py-6">
          More products coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {products.map((item) => (
            <NavLink
              key={item._id}
              to={`/products/${item._id}`}
              className="group flex flex-col lg:flex-row gap-3 border border-gray/10 p-2 hover:border-gray/40 transition"
            >
              <div className="aspect-[4/5] lg:aspect-square lg:w-24 lg:shrink-0 overflow-hidden bg-dark">
                <img
                  src={item.images?.[0] || placeholder}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="flex flex-col justify-center min-w-0 gap-2">
                <h3 className="text-white text-sm font-light line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-gray text-sm">
                  ₦{Number(item.price).toLocaleString("en-NG")}
                </p>
                <span className="text-xs uppercase tracking-wider text-white underline underline-offset-4">
                  View product
                </span>
              </div>
            </NavLink>
          ))}
        </div>
      )}

      <NavLink
        to="/shop"
        className="mt-5 border border-gray/20 p-3 flex justify-center text-xs uppercase tracking-widest hover:bg-white hover:text-dark transition"
      >
        Explore all products
      </NavLink>
    </aside>
  );
}
function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [extendedView, setExtendedview] = useState(false);
const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isButtonClicked, setIsButtenClicked] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setSelectedSize("");
        setActiveImageIndex(0);
        setQuantity(1);

        const response = await fetch(`${API_URL}/api/products/${id}`, {
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Unable to load this product.");
        }

        const foundProduct = data.product || data;

        if (!foundProduct?._id) {
          throw new Error("The product response was invalid.");
        }

        setProduct(foundProduct);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Product details error:", err);
          setError(err.message || "Unable to load this product.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = extendedView ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [extendedView]);

  useEffect(() => {
    setIsButtenClicked(false);
    setIsSuccess(false);
  }, [quantity, selectedSize]);

  if (loading) {
    return (
      <section className="min-h-screen bg-dark text-white flex items-center justify-center p-5">
        Loading product...
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="min-h-screen bg-dark text-white flex flex-col gap-4 items-center justify-center p-5 text-center">
        <h1 className="text-2xl">Product unavailable</h1>
        <p className="text-gray">{error || "We couldn't find this product."}</p>
        <button
          onClick={() => navigate("/shop")}
          className="border border-white p-3 hover:bg-white hover:text-dark"
        >
          Back to Shop
        </button>
      </section>
    );
  }

const productId = product._id;

const images = Array.isArray(product.images)
  ? product.images.filter(
      (url) => typeof url === "string" && url.trim() !== ""
    )
  : [];

const hasSlideshow = images.length > 1;

const image = images[activeImageIndex] || images[0] || placeholder;

const sizes = product.sizes || [];
  const favorite = isFavorite(productId);
  const available = product.isActive && product.stock > 0;
  const maxQuantity = Math.max(1, product.stock || 1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (!available) {
      alert("This product is currently unavailable.");
      return;
    }

    if (quantity > maxQuantity) {
      alert(`Only ${product.stock} item(s) are currently in stock.`);
      return;
    }

    setIsButtenClicked(true);
    setIsSuccess(false);

    addToCart(product, selectedSize, quantity);

    setTimeout(() => {
      setIsButtenClicked(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        <section className="product-details lg:pt-20 gap-2 relative overflow-x-hidden lg:flex w-full p-5 text-white">
          <div className="flex mt-14 lg:gap-2 top-13 left-10 z-10 lg:absolute justify-between w-full lg:w-auto">
            <button
              className="bg-transparent lg:bg-dark-soft border border-gray/20 p-2 cursor-pointer text-gray hover:text-white flex gap-1 items-center"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              <span className="text-sm">Back</span>
            </button>

            <div className="flex p-2 items-center gap-2 lg:bg-dark-soft bg-transparent border border-gray/20 text-gray">
              <span className="uppercase border-r border-gray/20 text-sm font-light pr-2">
                Share
              </span>
              <div className="flex gap-2 text-white">
                <FontAwesomeIcon icon={faInstagram} />
                <FontAwesomeIcon icon={faFacebook} />
                <FontAwesomeIcon icon={faXTwitter} />
                <FontAwesomeIcon icon={faPinterest} />
              </div>
            </div>
          </div>

          <div className="mt-2 relative bg-dark-soft w-full lg:w-fit gap-8 lg:flex items-center p-4 text-white">
            <div className="w-full absolute left-0 lg:left-90 lg:translate-x-[11%] lg:top-4 flex justify-between z-10">
              <Heart
                onClick={() => toggleFavorite(productId)}
                aria-label={
                  favorite ? "Remove from favorites" : "Add to favorites"
                }
                className="bg-dark-soft translate-x-[38%] mt-1 ml-1 w-10 h-10 p-[12px] hover:p-[10px] duration-150 text-white cursor-pointer"
                fill={favorite ? "currentColor" : "none"}
              />
            </div>

<div className="relative w-full lg:max-w-[500px] overflow-hidden">
  <img
    onClick={() => setExtendedview(true)}
    className="w-full cursor-zoom-in"
    src={image}
    alt={`${product.name} - Image ${activeImageIndex + 1}`}
  />

  {hasSlideshow && (
    <>
      {/* Previous image */}
      <button
        type="button"
        onClick={() =>
          setActiveImageIndex((current) =>
            (current - 1 + images.length) % images.length
          )
        }
        aria-label="Previous product image"
        className="absolute left-3 top-1/2 -translate-y-1/2
          bg-black/60 text-white p-2 rounded-full
          hover:bg-black/80 transition"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Next image */}
      <button
        type="button"
        onClick={() =>
          setActiveImageIndex((current) =>
            (current + 1) % images.length
          )
        }
        aria-label="Next product image"
        className="absolute right-3 top-1/2 -translate-y-1/2
          bg-black/60 text-white p-2 rounded-full
          hover:bg-black/80 transition"
      >
        <ChevronRight size={22} />
      </button>

      {/* Image indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2
        flex items-center gap-2 bg-black/50 rounded-full px-3 py-2">
        {images.map((url, index) => (
          <button
            key={`${url}-${index}`}
            type="button"
            onClick={() => setActiveImageIndex(index)}
            aria-label={`View image ${index + 1}`}
            aria-current={
              activeImageIndex === index ? "true" : undefined
            }
            className={`h-2 rounded-full transition-all ${
              activeImageIndex === index
                ? "w-5 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </>
  )}
</div>


            <div className="flex flex-col lg:max-w-[400px] w-full items-center">
              <div className="bg-dark px-6 py-2 text-center translate-y-[-10%]">
                <h1 className="lg:text-2xl lg:font-bold font-accent">
                  {product.name}
                </h1>
                <h2>₦{(product.price * quantity).toLocaleString("en-NG")}</h2>
              </div>

              <p className="mt-2 mb-2 text-center font-light">
                {product.description}
              </p>


              <div className="my-3">
                <p className="text-xs text-gray mb-2 text-center">Select size</p>
                <ul className="flex flex-wrap justify-center gap-1">
                  {sizes.map((size) => (
                    <li
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setIsSuccess(false);
                      }}
                      className={`cursor-pointer text-xs font-light text-center border px-3 py-2 transition ${
                        selectedSize === size
                          ? "border-white text-white"
                          : "border-gray/20 text-gray hover:border-white hover:text-white"
                      }`}
                    >
                      {size}
                    </li>
                  ))}
                </ul>
              </div>

              {available && (
                <p className="text-xs text-gray">
                  {product.stock === 0 ? "Out of Stock" : `${product.stock} item(s) available`} 
                </p>
              )}

              <div className="flex items-center gap-4 my-4">
                <button
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="border border-gray/20 w-9 h-9"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(maxQuantity, current + 1)
                    )
                  }
                  disabled={quantity >= maxQuantity}
                  className="border border-gray/20 w-9 h-9 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="w-full items-center justify-center gap-2 flex flex-col">
                {!selectedSize && available && (
                  <span className="font-light text-gray">Please pick a size</span>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={isButtonClicked || !available}
                  className={`flex-2/3 text-dark p-4 w-full flex justify-center items-center transition ${
                    available
                      ? "bg-white cursor-pointer hover:bg-gray-200"
                      : "bg-gray/20 cursor-not-allowed"
                  }`}
                >
                  {isButtonClicked ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center"
                    >
                      Please Wait
                      <DotLottieReact
                        className="text-dark w-10"
                        data={cartIconData}
                        loop
                        autoplay
                      />
                    </motion.span>
                  ) : isSuccess ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-bold"
                    >
                      Added to Bag!
                    </motion.span>
                  ) : !available ? (
                    "Out Of Stock"
                  ) : (
                    "Add to Bag"
                  )}
                </button>

                {isSuccess && (
                  <NavLink className="underline font-light text-gray" to="/cart">
                    View Bag
                  </NavLink>
                )}
              </div>
            </div>
          </div>

<RecommendedProducts currentProductId={productId} currentCategory={product.category}/>

          {extendedView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed w-full h-screen bg-transparent flex lg:flex-row lg:gap-2 flex-col items-center z-[200] p-5 justify-center backdrop-blur-3xl top-0 left-0"
            >
              <div className="flex p-2 items-center bg-gray/80 rounded justify-between w-full my-4">
                <h1 style={{ fontFamily: "Castoro titling" }}>{product.name}</h1>
                <button
                  onClick={() => setExtendedview(false)}
                  aria-label="Close expanded image"
                >
                  <X className="text-dark-soft bg-white-soft rounded p-1 w-8 h-8 cursor-pointer" />
                </button>
              </div>

              <img
                src={image}
                className="rounded max-h-[70vh] max-w-full object-contain"
                alt={product.name}
              />

              <div className="bg-gray/80 items-center p-2 my-4 flex w-full rounded justify-between">
                <span>SHARE</span>
                <span className="flex cursor-pointer items-center gap-2">
                  <FontAwesomeIcon icon={faFacebook} />
                  <FontAwesomeIcon icon={faInstagram} />
                  <FontAwesomeIcon icon={faXTwitter} />
                  <FontAwesomeIcon icon={faPinterest} />
                </span>
              </div>
            </motion.div>
          )}
        </section>
      </AnimatePresence>
    </>
  );
}

export default ProductDetails;