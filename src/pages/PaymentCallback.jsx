
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, CircleAlert, LoaderCircle } from "lucide-react";
import { useCart } from "../context/CartContext";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Checking your payment...");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function verifyPayment() {
      const reference =
        searchParams.get("reference") ||
        searchParams.get("trxref");

      if (!reference) {
        setStatus("error");
        setMessage("No payment reference was found.");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/payments/verify/${encodeURIComponent(reference)}`
        );

        const data = await response.json();

        if (cancelled) return;

        if (
          response.ok &&
          data.paymentStatus === "paid"
        ) {
          setStatus("success");
          setMessage("Your payment has been verified successfully.");
          setOrderId(data.orderId || "");
          clearCart();
        } else {
          setStatus("error");
          setMessage(
            data.error ||
              "We could not confirm your payment. Please contact Vandaluxe support before trying to pay again."
          );
        }
      } catch (error) {
        console.error("Payment verification error:", error);

        if (!cancelled) {
          setStatus("error");
          setMessage(
            "We could not check your payment right now. Please try again."
          );
        }
      }
    }

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [searchParams, clearCart]);

  return (
    <main className="min-h-screen bg-dark text-white px-6 py-20 flex items-center justify-center">
      <section className="w-full max-w-xl border border-gray/20 p-8 md:p-12 text-center">
        {status === "verifying" && (
          <LoaderCircle
            size={48}
            className="mx-auto mb-6 animate-spin"
          />
        )}

        {status === "success" && (
          <CheckCircle
            size={48}
            className="mx-auto mb-6 text-green-400"
          />
        )}

        {status === "error" && (
          <CircleAlert
            size={48}
            className="mx-auto mb-6 text-yellow-400"
          />
        )}

        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          {status === "verifying"
            ? "Verifying Payment"
            : status === "success"
              ? "Payment Successful"
              : "Payment Not Confirmed"}
        </h1>

        <p className="text-gray mb-6">{message}</p>

        {orderId && (
          <p className="text-sm text-gray mb-6 break-all">
            Order ID: {orderId}
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-gray mb-6">
            Avoid making another payment until you have checked your
            order status or contacted support.
          </p>
        )}

        {status !== "verifying" && (
          <Link
            to="/shop"
            className="inline-block bg-white text-dark px-8 py-4 hover:bg-gray-200 transition"
          >
            Continue Shopping
          </Link>
        )}
      </section>
    </main>
  );
}

export default PaymentCallback;
