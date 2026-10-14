import mongoose from "mongoose";
import express from "express";
import { randomUUID } from "node:crypto";
import Order from "../models/Order.js";

const router = express.Router();

const PAYSTACK_API = "https://api.paystack.co";

function getSecretKey() {
  return process.env.PAYSTACK_SECRET_KEY;
}

// POST /api/payments/initialize
router.post("/initialize", async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: "Order ID is required.",
      });
    }
if (!mongoose.isValidObjectId(orderId)) {
  return res.status(400).json({
    error: "Invalid order ID.",
  });
}
    if (!getSecretKey()) {
      return res.status(500).json({
        error: "Paystack is not configured on the server.",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    if (order.paymentMethod !== "paystack") {
      return res.status(400).json({
        error: "This order is not configured for Paystack.",
      });
    }

    if (order.paymentStatus !== "pending") {
      return res.status(400).json({
        error: "This order cannot be paid again.",
      });
    }

    if (!Number.isSafeInteger(Math.round(order.total * 100)) ||
        order.total <= 0) {
      return res.status(400).json({
        error: "Invalid order amount.",
      });
    }

    // Reuse the existing reference if the customer retries initialization.
    const reference = order.paymentReference || `vdx-${randomUUID()}`;

    const callbackUrl = process.env.PAYSTACK_CALLBACK_URL;

    const payload = {
      email: order.customer.email,
      amount: String(Math.round(order.total * 100)),
      currency: "NGN",
      reference,
      metadata: {
        orderId: order._id.toString(),
      },
    };

    if (callbackUrl) {
      payload.callback_url = callbackUrl;
    }

    const response = await fetch(
      `${PAYSTACK_API}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getSecretKey()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

if (!response.ok || !result.status || !result.data?.authorization_url) {
  console.error("Paystack initialization diagnostic:", {
    httpStatus: response.status,
    message: result.message,
    paystackStatus: result.status,
  });

  return res.status(502).json({
    error: "Unable to initialize payment. Please try again.",
  });
}

    order.paymentReference = result.data.reference;
    await order.save();

    return res.json({
      message: "Payment initialized.",
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);

    return res.status(500).json({
      error: "Unable to initialize payment.",
    });
  }
});

// GET /api/payments/verify/:reference
router.get("/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    if (!getSecretKey()) {
      return res.status(500).json({
        error: "Paystack is not configured on the server.",
      });
    }

    const order = await Order.findOne({
      paymentReference: reference,
    });

    if (!order) {
      return res.status(404).json({
        error: "No order was found for this payment reference.",
      });
    }

    // Already verified payments should remain paid.
    if (order.paymentStatus === "paid") {
      return res.json({
        message: "Payment already verified.",
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        orderId: order._id,
      });
    }

    const response = await fetch(
      `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${getSecretKey()}`,
        },
      }
    );

    const result = await response.json();
    const transaction = result.data;

    if (!response.ok || !result.status || !transaction) {
      return res.status(502).json({
        error: "Unable to verify payment right now.",
      });
    }

    const expectedAmount = Math.round(order.total * 100);

    const paymentMatches =
      transaction.status === "success" &&
      transaction.reference === order.paymentReference &&
      transaction.amount === expectedAmount &&
      transaction.currency === "NGN" &&
      transaction.customer?.email?.toLowerCase() ===
        order.customer.email.toLowerCase();

    if (!paymentMatches) {
      return res.status(400).json({
        error: "Payment has not been confirmed for this order.",
        paymentStatus: order.paymentStatus,
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";

    await order.save();

    return res.json({
      message: "Payment verified successfully.",
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      error: "Unable to verify payment.",
    });
  }
});

export default router;
