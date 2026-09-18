import { Link } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import { useState, useEffect } from "react";

import { useCart } from "../context/CartContext";

function Checkout() {
  const { cart, cartTotal } = useCart();

  const [deliveryDetails, setDeliveryDetails] = useState({
    city: "",
    zone: "",
    fee: 0,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    deliveryNote: "",
  });

  useEffect(() => {
    const savedDelivery = localStorage.getItem("deliveryDetails");

    if (savedDelivery) {
      setDeliveryDetails(JSON.parse(savedDelivery));
    }
  }, []);

  const deliveryFee = deliveryDetails.fee || 0;

  const total = cartTotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Paystack will be connected here later.
    console.log({
      customer: formData,
      delivery: deliveryDetails,
      cart,
      subtotal: cartTotal,
      deliveryFee,
      total,
    });
  };

  if (cart.length === 0) {
    return (
      <main className="bg-dark text-white min-h-screen px-6 md:px-12 py-20 mt-16">
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
    <main className="bg-dark text-white min-h-screen px-6 md:px-12 py-12 md:py-20 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/cart"
            className="inline-flex border border-gray/20 p-2 hover:border-white items-center gap-2 text-gray hover:text-white transition mb-8"
          >
            <ArrowLeft size={18} />

            Back to Bag
          </Link>

          <h1 className="text-4xl md:text-6xl font-semibold">
            Checkout
          </h1>

          <p className="text-gray mt-3">
            Enter your details to complete your order.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Customer Information */}
            <div className="lg:col-span-2 space-y-10">
              {/* Contact */}
              <section>
                <h2 className="text-2xl font-medium mb-6">
                  Contact Information
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-transparent border border-gray/20 p-4 outline-none focus:border-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08012345678"
                      required
                      className="w-full bg-transparent border border-gray/20 p-4 outline-none focus:border-white transition"
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
                    <label className="block text-sm text-gray mb-2">
                      First Name
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      required
                      className="w-full bg-transparent border border-gray/20 p-4 outline-none focus:border-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray mb-2">
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      required
                      className="w-full bg-transparent border border-gray/20 p-4 outline-none focus:border-white transition"
                    />
                  </div>
                </div>
              </section>

              {/* Delivery */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-medium">
                    Delivery
                  </h2>

                  <Link
                    to="/cart"
                    className="text-sm text-gray hover:text-white transition"
                  >
                    Change
                  </Link>
                </div>

                {/* Selected Delivery Zone */}
                <div className="border border-gray/20 p-5 mb-5">
                  <div className="flex justify-between gap-6">
                    <div>
                      <p className="text-sm text-gray mb-1">
                        Delivery Zone
                      </p>

                      <p className="font-medium">
                        {deliveryDetails.city || "Not selected"}
                      </p>

                      <p className="text-gray mt-1">
                        {deliveryDetails.zone || "No zone selected"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray mb-1">
                        Delivery Fee
                      </p>

                      <p className="font-medium">
                        {deliveryFee > 0
                          ? `₦${deliveryFee.toLocaleString()}`
                          : "Not selected"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray mb-2">
                      Street Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address"
                      required
                      className="w-full bg-transparent border border-gray/20 p-4 outline-none focus:border-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray mb-2">
                      Additional Delivery Information
                    </label>

                    <textarea
                      name="deliveryNote"
                      value={formData.deliveryNote}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Apartment number, landmark, or other delivery instructions..."
                      className="w-full bg-transparent border border-gray/20 p-4 outline-none focus:border-white transition resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-2xl font-medium mb-6">
                  Payment
                </h2>

                <div className="border border-gray/20 p-5">
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      checked
                      readOnly
                      className="mt-1"
                    />

                    <div>
                      <p className="font-medium">
                        Pay Online
                      </p>

                      <p className="text-sm text-gray mt-1">
                        You will be redirected to Paystack to securely
                        complete your payment.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Mobile Pay Button */}
              <button
                type="submit"
                className="lg:hidden bg-white text-dark w-full p-4 hover:bg-gray-200 transition"
              >
                Pay ₦{total.toLocaleString()}
              </button>
            </div>

            {/* Order Summary */}
            <aside>
              <div className="border border-gray/20 p-6 md:p-8 lg:sticky lg:top-8">
                <h2 className="text-2xl font-medium mb-8">
                  Your Order
                </h2>

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
                        <h3 className="text-sm font-medium">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray mt-1">
                          Size: {item.size}
                        </p>

                        <p className="text-sm text-gray mt-1">
                          Quantity: {item.quantity}
                        </p>

                        <p className="text-sm mt-2">
                          ₦
                          {(
                            item.price * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t border-gray/20 mt-8 pt-6 space-y-4">
                  <div className="flex justify-between text-gray">
                    <span>Subtotal</span>

                    <span className="text-white">
                      ₦{cartTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray">
                    <span>Delivery</span>

                    <span className="text-white">
                      {deliveryFee > 0
                        ? `₦${deliveryFee.toLocaleString()}`
                        : "Not selected"}
                    </span>
                  </div>

                  <div className="border-t border-gray/20 pt-5 flex justify-between text-xl font-medium">
                    <span>Total</span>

                    <span>
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Desktop Pay Button */}
                <button
                  type="submit"
                  className="hidden lg:block bg-white text-dark w-full p-4 mt-8 hover:bg-gray-200 transition"
                >
                  Pay ₦{total.toLocaleString()}
                </button>

                <p className="text-xs text-gray text-center mt-4">
                  Your payment will be securely processed by Paystack.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Checkout;