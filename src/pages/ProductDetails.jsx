import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, X } from "lucide-react";
import { selection } from "../data/data";
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

import "../index.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = selection.find((product) => product.id === Number(id));

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  const [extendedView, setExtendedview] = useState(false);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [sizeActive, setSizeActive] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isButtonClicked, setIsButtenClicked] = useState(false);
  const [isDisabled, setisDisabled] = useState(
    "bg-gray/20 flex-2/3 text-dark p-4 w-full flex justify-center items-center cursor-not-allowed transition",
  );

  useEffect(() => {
    if (extendedView) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [extendedView]);

  if (!product) {
    return <h1>Product not found</h1>;
  }

  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }
    setIsButtenClicked(true);
    setIsSuccess(false);

    addToCart(product, selectedSize, quantity);

    setTimeout(() => {
      setIsButtenClicked(false);
      setIsSuccess(true);
    }, 2800);
  };

  useEffect(() => {
    setIsButtenClicked(false);
    setIsSuccess(false);
  }, [quantity, selectedSize]);

  return (
    <AnimatePresence>
      <section className="product-details lg:pt-20 gap-2 relative overflow-x-hidden lg:flex w-full p-5">
        <div className="flex mt-14 lg:gap-2 top-13 left-10 z-10 lg:absolute justify-between">
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

            <div className="flex gap-1 text-white">
              <FontAwesomeIcon
                className="hover:text-gray cursor-pointer"
                icon={faInstagram}
              />

              <FontAwesomeIcon
                className="hover:text-gray cursor-pointer"
                icon={faFacebook}
              />

              <FontAwesomeIcon
                className="hover:text-gray cursor-pointer"
                icon={faXTwitter}
              />

              <FontAwesomeIcon
                className="hover:text-gray cursor-pointer"
                icon={faPinterest}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 relative bg-dark-soft w-fit gap-8 lg:flex items-center p-4 text-white">
          <div className="w-full absolute left-0 lg:left-90 lg:translate-x-[11%] lg:top-4 flex justify-between">
            <Heart
              onClick={() => toggleFavorite(product.id)}
              aria-label={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
              className="bg-dark-soft translate-x-[38%] mt-1 ml-1 w-10 h-10 p-[12px] hover:p-[10px] duration-150 text-white"
              fill={favorite ? "currentColor" : "none"}
            />
          </div>

          <img
            onClick={() => setExtendedview(!extendedView)}
            className="w-full lg:max-w-[500px] cursor-pointer"
            src={product.img}
            alt={product.name}
          />

          <div className="flex flex-col lg:max-w-[400px] w-full items-center">
            <div className="bg-dark px-6 py-2 text-center absolute translate-y-[-50%]">
              <h1 className="lg:text-2xl lg:font-bold font-accent">
                {product.name}
              </h1>

              <h2>₦{product.price * quantity}</h2>
            </div>

            <p className="mt-10 mb-2 text-center font-light">
              {product.description}
            </p>

            <span
              onClick={() => setSizeGuide(!sizeGuide)}
              className="font-light lg:hidden text-sm cursor-pointer uppercase underline"
            >
              View Size guide
            </span>

            {/* SIZE + COLOR */}
            <div className="my-2">
              <ul className="flex gap-1">
                {product.size.map((size) => (
                  <li
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setisDisabled(
                        "bg-white flex-2/3 text-dark p-4 w-full flex justify-center items-center cursor-pointer hover:bg-gray-200 transition",
                      );
                      setSizeActive(true);
                    }}
                    className={`
                      cursor-pointer
                      uppercase
                      text-xs
                      font-light
                      w-10
                      text-center
                      border
                      p-2
                      transition
                      ${
                        selectedSize === size
                          ? "border-white text-white"
                          : "border-gray/20 text-gray hover:border-white hover:text-white"
                      }
                    `}
                  >
                    {size}
                  </li>
                ))}
              </ul>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-4 my-4">
              <button
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                className="border border-gray/20 w-9 h-9"
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => setQuantity((current) => current + 1)}
                className="border border-gray/20 w-9 h-9"
              >
                +
              </button>
            </div>

            {/* ADD TO BAG */}
            <div className="w-full items-center justify-center gap-2 flex flex-col">
              <span
                className={sizeActive ? "hidden" : "block font-light text-gray"}
              >
                Please pick a size
              </span>
              <button
                onClick={handleAddToCart}
                id="addToCart"
                className={isDisabled}
              >
                <span>
                  {isButtonClicked ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex items-center justify-center "
                    >
                      <span>Please Wait</span>
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
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex items-center justify-center font-bold "
                    >
                      Success!
                    </motion.span>
                  ) : (
                    "Add to Bag"
                  )}
                </span>
              </button>
              {isSuccess && (
                <NavLink className="underline font-light text-gray" to="/cart">
                  View Bag
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* DESKTOP SIZE GUIDE */}
        <div className="lg:block flex-1/3 p-5 mt-2 hidden bg-dark-soft">
          <div className="border-b border-gray/20 pb-4">
            <span className="uppercase text-white">size chart</span>
          </div>

          <div className="uppercase my-4 bg-transparent border border-gray/20 text-white p-2">
            sizes in inches
          </div>

          <table className="text-white border border-gray/20 p-4">
            <thead>
              <tr className="uppercase">
                <th>size</th>
                <th>chest</th>
                <th>waist</th>
                <th>hip</th>
                <th>inseam</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="uppercase font-semibold">xxs</td>
                <td>29"-30"</td>
                <td>21"-23"</td>
                <td>33"-34"</td>
                <td>26"</td>
              </tr>

              <tr>
                <td className="uppercase">xs</td>
                <td>31"-32"</td>
                <td>24"-25"</td>
                <td>35"-36"</td>
                <td>26.5"</td>
              </tr>

              <tr>
                <td className="uppercase">s</td>
                <td>33"-34"</td>
                <td>26"-27"</td>
                <td>37"-38"</td>
                <td>27.5"</td>
              </tr>

              <tr>
                <td className="uppercase">m</td>
                <td>35"-36"</td>
                <td>28"-29"</td>
                <td>39"-40"</td>
                <td>28"</td>
              </tr>

              <tr>
                <td className="uppercase">l</td>
                <td>37"-38"</td>
                <td>30"-31"</td>
                <td>41"-42"</td>
                <td>28.5"</td>
              </tr>

              <tr>
                <td className="uppercase">xl</td>
                <td>39"-40"</td>
                <td>32"-34"</td>
                <td>43"-44"</td>
                <td>29"</td>
              </tr>

              <tr>
                <td className="uppercase">xxl</td>
                <td>41"-42"</td>
                <td>35"-37"</td>
                <td>45"-46"</td>
                <td>29.5"</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* MOBILE SIZE GUIDE */}
        {sizeGuide && (
          <motion.div className="flex-1/3 block lg:hidden p-5 mt-2 bg-dark-soft">
            <div className="border-b border-gray/20 pb-4">
              <span className="uppercase text-white">size chart</span>
            </div>

            <div className="uppercase my-4 bg-transparent border border-gray/20 text-white p-2">
              sizes in inches
            </div>

            <div className="overflow-x-auto tble">
              <table className="text-white border border-gray/20 p-4">
                <thead>
                  <tr className="uppercase">
                    <th>size</th>
                    <th>chest</th>
                    <th>waist</th>
                    <th>hip</th>
                    <th>inseam</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="uppercase font-semibold">xxs</td>
                    <td>29"-30"</td>
                    <td>21"-23"</td>
                    <td>33"-34"</td>
                    <td>26"</td>
                  </tr>

                  <tr>
                    <td className="uppercase">xs</td>
                    <td>31"-32"</td>
                    <td>24"-25"</td>
                    <td>35"-36"</td>
                    <td>26.5"</td>
                  </tr>

                  <tr>
                    <td className="uppercase">s</td>
                    <td>33"-34"</td>
                    <td>26"-27"</td>
                    <td>37"-38"</td>
                    <td>27.5"</td>
                  </tr>

                  <tr>
                    <td className="uppercase">m</td>
                    <td>35"-36"</td>
                    <td>28"-29"</td>
                    <td>39"-40"</td>
                    <td>28"</td>
                  </tr>

                  <tr>
                    <td className="uppercase">l</td>
                    <td>37"-38"</td>
                    <td>30"-31"</td>
                    <td>41"-42"</td>
                    <td>28.5"</td>
                  </tr>

                  <tr>
                    <td className="uppercase">xl</td>
                    <td>39"-40"</td>
                    <td>32"-34"</td>
                    <td>43"-44"</td>
                    <td>29"</td>
                  </tr>

                  <tr>
                    <td className="uppercase">xxl</td>
                    <td>41"-42"</td>
                    <td>35"-37"</td>
                    <td>45"-46"</td>
                    <td>29.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </section>

      {/* EXTENDED IMAGE VIEW */}
      {extendedView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="fixed w-full h-screen bg-transparent flex lg:flex-row lg:gap-2 flex-col items-center z-200 p-5 justify-center backdrop-blur-3xl top-0"
        >
          <div className="flex p-2 items-center bg-gray/80 rounded justify-between w-full my-4">
            <h1 style={{ fontFamily: "Castoro titling" }}>{product.name}</h1>

            <X
              onClick={() => setExtendedview(!extendedView)}
              className="text-dark-soft bg-white-soft rounded p-1 w-8 h-8 cursor-pointer"
            />
          </div>

          <img src={product.img} className="rounded" alt={product.name} />

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
    </AnimatePresence>
  );
}

export default ProductDetails;
