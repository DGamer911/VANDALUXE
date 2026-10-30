
import mongoose from "mongoose";
import express from "express";
import {
  randomUUID,
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import Order from "../models/Order.js";

const router = express.Router();

const PAYSTACK_API = "https://api.paystack.co";

function getSecretKey() {
  return process.env.PAYSTACK_SECRET_KEY;
}

// Verify a transaction directly with Paystack.
async function verifyWithPaystack(reference) {
  const response = await fetch(
    `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok || !result.status || !result.data) {
    throw new Error(
      result.message || "Paystack transaction verification failed."
    );
  }

  return result.data;
}

// Check that the transaction belongs to the expected order.
function transactionMatchesOrder(transaction, order) {
  const expectedAmount = Math.round(order.total * 100);

  const emailMatches =
    !transaction.customer?.email ||
    transaction.customer.email.toLowerCase() ===
      order.customer.email.toLowerCase();

  return (
    transaction.status === "success" &&
    transaction.reference === order.paymentReference &&
    transaction.amount === expectedAmount &&
    transaction.currency === "NGN" &&
    emailMatches
  );
}

// Update the order without downgrading an advanced order status.
async function markOrderAsPaid(order) {
  order.paymentStatus = "paid";

  if (order.orderStatus === "pending") {
    order.orderStatus = "confirmed";
  }

  await order.save();
}

// Verify Paystack's webhook signature using the original raw body.
function isValidPaystackSignature(req) {
  const signature = req.get("x-paystack-signature");
  const secretKey = getSecretKey();

  if (
    !signature ||
    !secretKey ||
    !Buffer.isBuffer(req.body)
  ) {
    return false;
  }

  const expectedSignature = createHmac("sha512", secretKey)
    .update(req.body)
    .digest("hex");

  const receivedBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
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

    if (
      !Number.isSafeInteger(Math.round(order.total * 100)) ||
      order.total <= 0
    ) {
      return res.status(400).json({
        error: "Invalid order amount.",
      });
    }

    // Reuse the existing reference if the customer retries.
    const reference =
      order.paymentReference || `vdx-${randomUUID()}`;

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

    if (
      !response.ok ||
      !result.status ||
      !result.data?.authorization_url
    ) {
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


// POST /api/payments/webhook
router.post("/webhook", async (req, res) => {
  try {
    if (!getSecretKey()) {
      return res.sendStatus(500);
    }

    // Reject requests that do not have a valid Paystack signature.
    if (!isValidPaystackSignature(req)) {
      console.error("Rejected Paystack webhook: invalid signature.");
      return res.sendStatus(401);
    }

    const event = JSON.parse(req.body.toString("utf8"));

    // We only process successful charge events.
    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const reference = event.data?.reference;

    if (!reference) {
      return res.sendStatus(200);
    }

    const order = await Order.findOne({
      paymentReference: reference,
    });

    if (!order) {
      console.error("Paystack webhook: no matching order.", {
        reference,
      });

      // Return an error so Paystack can retry the notification.
      return res.sendStatus(404);
    }

    // Already processed successfully.
    if (order.paymentStatus === "paid") {
      return res.sendStatus(200);
    }

    if (order.paymentMethod !== "paystack") {
      console.error("Webhook received for a non-Paystack order.", {
        reference,
        orderId: order._id,
      });

      return res.sendStatus(200);
    }

    // Do not trust the event alone. Verify the transaction with Paystack.
    const transaction = await verifyWithPaystack(reference);

    if (!transactionMatchesOrder(transaction, order)) {
      console.error("Paystack webhook transaction mismatch.", {
        reference,
        transactionStatus: transaction.status,
        transactionAmount: transaction.amount,
        expectedAmount: Math.round(order.total * 100),
        transactionCurrency: transaction.currency,
        transactionEmail: transaction.customer?.email,
        orderEmail: order.customer.email,
      });

      return res.sendStatus(400);
    }

    await markOrderAsPaid(order);

    console.log("Paystack webhook: order payment confirmed.", {
      orderId: order._id,
      reference,
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error("Paystack webhook error:", error);

    // A server error allows Paystack to retry later.
    return res.sendStatus(500);
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

    if (order.paymentStatus === "paid") {
      return res.json({
        message: "Payment already verified.",
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        orderId: order._id,
      });
    }

    if (order.paymentMethod !== "paystack") {
      return res.status(400).json({
        error: "This order is not configured for Paystack.",
      });
    }

    const transaction = await verifyWithPaystack(reference);

    if (!transactionMatchesOrder(transaction, order)) {
      console.error("Payment verification mismatch:", {
        reference,
        transactionStatus: transaction.status,
        transactionAmount: transaction.amount,
        expectedAmount: Math.round(order.total * 100),
        transactionCurrency: transaction.currency,
        transactionEmail: transaction.customer?.email,
        orderEmail: order.customer.email,
      });

      return res.status(400).json({
        error: "Payment has not been confirmed for this order.",
        paymentStatus: order.paymentStatus,
      });
    }

    await markOrderAsPaid(order);

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
