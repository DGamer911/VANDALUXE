import { Link } from "react-router-dom";
import { ArrowLeft, Dot, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import deliveryZones from "../data/deliveryDetails";

import "../index.css";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Load previously selected delivery details
  useEffect(() => {
    const savedDelivery = localStorage.getItem("deliveryDetails");

    if (savedDelivery) {
      const parsedDelivery = JSON.parse(savedDelivery);

      setSelectedCity(parsedDelivery.city || "");
      setSelectedZone(parsedDelivery.zone || "");
      setDeliveryFee(parsedDelivery.fee || 0);
    }
  }, []);

  // Update delivery fee when city or zone changes
  useEffect(() => {
    if (selectedCity && selectedZone) {
      const fee = deliveryZones[selectedCity]?.[selectedZone] || 0;

      setDeliveryFee(fee);

      localStorage.setItem(
        "deliveryDetails",
        JSON.stringify({
          city: selectedCity,
          zone: selectedZone,
          fee,
        }),
      );
    } else {
      setDeliveryFee(0);
      localStorage.removeItem("deliveryDetails");
    }
  }, [selectedCity, selectedZone]);

  const availableZones = selectedCity
    ? Object.keys(deliveryZones[selectedCity] || {})
    : [];

  const total = cartTotal + deliveryFee;

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedZone("");
    setDeliveryFee(0);
  };

  const handleZoneChange = (e) => {
    setSelectedZone(e.target.value);
  };

  const handleCheckout = () => {
    if (!selectedCity || !selectedZone) {
      alert("Please select your delivery location before checkout.");
      return;
    }

    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <main className="bg-dark text-white min-h-screen px-6 md:px-12 mt-16 p-5">
        <button
          className="bg-transparent lg:bg-dark-soft border border-gray/20 p-2 cursor-pointer text-gray hover:text-white mb-4 flex gap-1 items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6">
            Your Bag Is Empty
          </h1>

          <p className="text-gray mb-8">
            You haven't added anything to your bag yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <AnimatePresence>
      <main className="bg-dark text-white min-h-screen px-6 md:px-12 py-12 md:py-20 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center justify-between w-full">
              <button
                className="bg-transparent lg:bg-dark-soft border border-gray/20 p-2 cursor-pointer text-gray hover:text-white flex gap-1 items-center"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={18} />

                <span className="text-sm">Back</span>
              </button>

              <div className="flex items-center">
                <h1 className="text-xl md:text-4xl font-semibold">Your Bag</h1>

                <Dot />

                <p className="text-gray text-sm">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="border border-gray/20 p-4 md:p-6"
                >
                  <div className="flex gap-4 md:gap-6">
                    {/* Product Image */}
                    <div className="w-28 h-36 md:w-40 md:h-52 bg-gray-100 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col flex-1">
                      <div className="flex lg:flex-row md:flex-row flex-col justify-between gap-4">
                        <div>
                          <h2 className="text-lg md:text-xl font-medium">
                            {item.name}
                          </h2>

                          <p className="text-gray mt-1 font-light">
                            Size:{" "}
                            <span className="text-white">{item.size}</span>
                          </p>
                        </div>

                        <p className="text-lg font-medium">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray/20">
                          <button
                            onClick={() =>
                              decreaseQuantity(item.productId, item.size)
                            }
                            className="p-3 hover:bg-white hover:text-dark transition"
                          >
                            <Minus size={16} />
                          </button>

                          <motion.span
                            initial={{
                              y: -2,
                              opacity: 0,
                            }}
                            animate={{
                              y: 0,
                              opacity: 1,
                            }}
                            exit={{
                              y: -2,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.3,
                              ease: "easeOut",
                            }}
                            className="px-5"
                          >
                            {item.quantity}
                          </motion.span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.productId, item.size)
                            }
                            className="p-3 hover:bg-white hover:text-dark transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() =>
                            removeFromCart(item.productId, item.size)
                          }
                          className="text-gray hover:text-red-500 transition flex items-center gap-2"
                        >
                          <Trash2 size={17} />

                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <div className="border border-gray/20 p-6 md:p-8 sticky top-8">
                <h2 className="text-2xl font-medium mb-8">Order Summary</h2>

                {/* Delivery Location */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    Delivery Location
                  </h3>

                  {/* City */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray mb-2">City</label>

                    <select
                      value={selectedCity}
                      onChange={handleCityChange}
                      className="w-full bg-dark border border-gray/20 p-4 outline-none focus:border-white transition"
                    >
                      <option value="">Select your city</option>

                      {Object.keys(deliveryZones).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Zone */}
                  <div>
                    <label className="block text-sm text-gray mb-2">
                      Delivery Zone
                    </label>

                    <select
                      value={selectedZone}
                      onChange={handleZoneChange}
                      disabled={!selectedCity}
                      className="w-full bg-dark border border-gray/20 p-4 outline-none focus:border-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {selectedCity
                          ? "Select your delivery zone"
                          : "Select a city first"}
                      </option>

                      {availableZones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone} — ₦
                          {deliveryZones[selectedCity][zone].toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between text-gray mb-4">
                  <span>Subtotal</span>

                  <span className="text-white">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between text-gray mb-6">
                  <span>Delivery</span>

                  <span className="text-right">
                    {deliveryFee > 0
                      ? `₦${deliveryFee.toLocaleString()}`
                      : "Select zone"}
                  </span>
                </div>

                {/* Total */}
                <div className="border-t border-gray/20 pt-6 flex justify-between text-xl font-medium">
                  <span>Total</span>

                  <span>₦{total.toLocaleString()}</span>
                </div>

                {/* Checkout */}
                <button
                  onClick={handleCheckout}
                  className={`block text-center w-full p-4 mt-8 transition ${
                    selectedCity && selectedZone
                      ? "bg-white text-dark hover:bg-gray-200"
                      : "bg-gray/20 text-gray cursor-not-allowed"
                  }`}
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/shop"
                  className="flex items-center justify-center gap-2 mt-6 text-gray hover:text-white transition"
                >
                  <ArrowLeft size={17} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AnimatePresence>
  );
}

export default Cart;
