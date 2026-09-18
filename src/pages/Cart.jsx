import { Link } from "react-router-dom";

import { ArrowLeft, Dot, Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";

import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "motion/react";

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

  const sizeNames = {
    XS: "Extra Small",
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra Large",
    XXL: "Double Extra Large",
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <main className="bg-dark text-white flex justify-center items-center relative min-h-screen px-6 md:px-12 mt-16 p-5">
        <button
          className="bg-transparent lg:bg-dark-soft border absolute top-5 left-5 border-gray/20 p-2  justify-center cursor-pointer text-gray hover:text-white mb-4 flex gap-1 items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="max-w-5xl flex flex-col justify-center items-center mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6">
            Your Bag Is Empty
          </h1>

          <p className="text-gray mb-8">
            You haven't added anything to your bag yet.
          </p>
          <Link
            to="/shop"
            className="flex bg-white p-4 max-w-xs items-center justify-center gap-2 text-dark hover:bg-gray transition"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
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
            <div className="lg:col-span-2 w-full space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="border border-gray/20 md:p-6"
                >
                  <div className="flex flex-col w-full md:gap-6">
                    {/* Product Image */}
                    <div className="flex lg:gap-4 gap-2 p-2">
                      <div className="w-28 h-36 md:w-40 md:h-52 bg-gray-100 shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex flex-col flex-1">
                        <div className="flex">
                          <div className="flex lg:flex-row md:flex-row flex-col justify-between gap-4">
                            <div>
                              <h2 className="text-lg md:text-xl font-medium">
                                {item.name}
                              </h2>

                              <p className="text-gray mt-1 font-light">
                                Size:{" "}
                                <span className="text-white">
                                  {sizeNames[item.size] || item.size}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="hidden items-end lg:flex-col-reverse lg:flex flex-col p-2 text-right w-full">
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray">
                                ₦{item.price.toLocaleString()} each
                              </p>
                            )}

                            <p className="text-lg font-medium">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
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
                            className="text-gray border-gray/20 border max-w-50 h-full w-full text-center justify-center hover:text-red-500 transition flex items-center gap-2"
                          >
                            <Trash2 size={17} />

                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item Price */}
                    <div className="flex items-center lg:hidden justify-between p-2 border-t border-gray/20 w-full">
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray">
                          ₦{item.price.toLocaleString()} each
                        </p>
                      )}

                      <p className="text-lg font-medium">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <div className="border border-gray/20 p-6 md:p-8 sticky top-8">
                <h2 className="text-2xl font-medium mb-8">Order Summary</h2>

                {/* Subtotal */}
                <div className="flex justify-between text-gray mb-4">
                  <span>Subtotal</span>

                  <span className="text-white">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>

                {/* Delivery Information */}
                <div className="border border-gray/20 p-4 mb-6">
                  <p className="text-sm font-medium text-white mb-2">
                    Delivery
                  </p>

                  <p className="text-sm text-gray leading-relaxed">
                    Your order will be delivered via Bolt. Delivery fees vary
                    based on your location and current Bolt pricing and are not
                    included in the order total. The delivery fee will be paid
                    separately on delivery.
                  </p>
                </div>

                {/* Total */}
                <div className="border-t border-gray/20 pt-6 flex justify-between text-xl font-medium">
                  <span>Total</span>

                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>

                {/* Checkout */}
                <button
                  onClick={handleCheckout}
                  className="block text-center w-full p-4 mt-8 bg-white text-dark hover:bg-gray-200 transition"
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
