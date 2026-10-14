import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function Checkout() {
  const { cart, cartTotal } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    deliveryNote: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  const total = cartTotal;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (errorMessage) setErrorMessage("");
  };

  const handlePayment = async (orderId) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/payments/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not start payment.");
      }

      if (!data.authorizationUrl) {
        throw new Error("Paystack did not return a payment URL.");
      }

      window.location.assign(data.authorizationUrl);
    } catch (error) {
      console.error("Payment initialization error:", error);
      setErrorMessage(error.message || "Unable to start payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Cart items being submitted:", cart);

    if (isSubmitting || createdOrder) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            deliveryNote: formData.deliveryNote.trim(),
          },
          items: cart.map((item) => ({
            productId: String(item.productId),
            size: item.size,
            quantity: Number(item.quantity),
          })),
          paymentMethod: "paystack",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to create your order. Please try again.",
        );
      }

      setCreatedOrder(data.order);
      await handlePayment(data.order.id);
    } catch (error) {
      console.error("Checkout error:", error);

      setErrorMessage(
        error.message === "Failed to fetch"
          ? "Could not connect to the Vandaluxe API. Make sure your backend is running."
          : error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border border-gray/20 p-4 outline-none focus:border-white transition";

  if (cart.length === 0 && !createdOrder) {
    return (
      <main className="bg-dark py-12 text-white min-h-screen px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Your Bag Is Empty
          </h1>

          <p className="text-gray mb-8">
            Add something to your bag before proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="inline-block bg-white text-dark px-8 py-4 hover:bg-gray-200 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-dark text-white min-h-screen px-6 md:px-12 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link
            to="/cart"
            className="inline-flex border border-gray/20 p-2 hover:border-white items-center gap-2 text-gray hover:text-white transition mb-8"
          >
            <ArrowLeft size={18} />
            Back to Bag
          </Link>

          <h1 className="text-4xl md:text-6xl font-semibold">Checkout</h1>

          <p className="text-gray mt-3">
            Enter your details to complete your order.
          </p>
        </div>

        {createdOrder ? (
          <section className="max-w-2xl border border-gray/20 p-6 md:p-10">
            <h2 className="text-3xl font-semibold mb-4">
              Order Created Successfully
            </h2>

            <p className="text-gray mb-4">
              Your order has been saved. Payment has not been completed yet.
            </p>

            <p className="mb-2">
              Order ID:{" "}
              <span className="font-mono break-all">{createdOrder.id}</span>
            </p>

            <p className="mb-2">
              Total: ₦{Number(createdOrder.total).toLocaleString()}
            </p>

            <p className="mb-8">
              Payment status:{" "}
              <span className="text-yellow-400">
                {createdOrder.paymentStatus}
              </span>
            </p>

            {errorMessage && (
              <p role="alert" className="text-red-300 mb-4">
                {errorMessage}
              </p>
            )}

            <button
              type="button"
              onClick={() => handlePayment(createdOrder.id)}
              disabled={isSubmitting}
              className="bg-white text-dark px-8 py-4 mb-4 disabled:opacity-50"
            >
              {isSubmitting
                ? "Connecting to Paystack..."
                : "Continue to Payment"}
            </button>

            <Link
              to="/shop"
              className="inline-block bg-white text-dark px-8 py-4 hover:bg-gray-200 transition"
            >
              Continue Shopping
            </Link>
          </section>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <div
                role="alert"
                className="border border-red-500/50 text-red-300 p-4 mb-8"
              >
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                {/* Contact Information */}
                <section>
                  <h2 className="text-2xl font-medium mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm text-gray mb-2"
                      >
                        Email Address
                      </label>

                      <input
                        id="email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm text-gray mb-2"
                      >
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="08012345678"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                {/* Customer Details */}
                <section>
                  <h2 className="text-2xl font-medium mb-6">
                    Customer Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm text-gray mb-2"
                      >
                        First Name
                      </label>

                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm text-gray mb-2"
                      >
                        Last Name
                      </label>

                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                {/* Delivery Information */}
                <section>
                  <h2 className="text-2xl font-medium mb-6">
                    Delivery Information
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm text-gray mb-2"
                      >
                        Street Address
                      </label>

                      <input
                        id="address"
                        type="text"
                        name="address"
                        autoComplete="street-address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm text-gray mb-2"
                      >
                        City
                      </label>

                      <input
                        id="city"
                        type="text"
                        name="city"
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="deliveryNote"
                        className="block text-sm text-gray mb-2"
                      >
                        Additional Delivery Information
                      </label>

                      <textarea
                        id="deliveryNote"
                        name="deliveryNote"
                        value={formData.deliveryNote}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Apartment number, landmark, or other delivery instructions..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Information */}
                <section>
                  <h2 className="text-2xl font-medium mb-6">Payment</h2>

                  <div className="border border-gray/20 p-5">
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        checked
                        readOnly
                        aria-label="Pay online with Paystack"
                        className="mt-1"
                      />

                      <div>
                        <p className="font-medium">Pay Online</p>

                        <p className="text-sm text-gray mt-1">
                          Paystack will securely process your payment once the
                          payment integration is complete.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Mobile Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || Boolean(createdOrder)}
                  className="lg:hidden bg-white text-dark w-full p-4 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Creating Order..."
                    : `Place Order — ₦${total.toLocaleString()}`}
                </button>
              </div>

              {/* Order Summary */}
              <aside>
                <div className="border border-gray/20 p-6 md:p-8 lg:sticky lg:top-8">
                  <h2 className="text-2xl font-medium mb-8">Your Order</h2>

                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div
                        key={`${item.productId}-${item.size}`}
                        className="flex gap-4"
                      >
                        <div className="w-20 h-24 bg-gray-100 shrink-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-sm font-medium">{item.name}</h3>

                          <p className="text-sm text-gray mt-1">
                            Size: {item.size}
                          </p>

                          <p className="text-sm text-gray mt-1">
                            Quantity: {item.quantity}
                          </p>

                          <p className="text-sm mt-2">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray/20 mt-8 pt-6 space-y-4">
                    <div className="flex justify-between text-gray">
                      <span>Subtotal</span>

                      <span className="text-white">
                        ₦{cartTotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray">
                      <span>Delivery</span>
                      <span>Paid separately</span>
                    </div>

                    <div className="border-t border-gray/20 pt-5 flex justify-between text-xl font-medium">
                      <span>Total</span>

                      <span>₦{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Desktop Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || Boolean(createdOrder)}
                    className="hidden lg:block bg-white text-dark w-full p-4 mt-8 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Creating Order..."
                      : `Place Order — ₦${total.toLocaleString()}`}
                  </button>

                  <p className="text-xs text-gray text-center mt-4">
                    This step creates your order. Payment is not collected yet.
                  </p>
                </div>
              </aside>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default Checkout;
