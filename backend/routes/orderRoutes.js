
import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

import {
  getAdminOrders,
  getOrderStats,
  updateOrderStatus,
  getAdminOrderById,
} from "../controllers/orderController.js";

import protectAdmin from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/admin/all", protectAdmin, getAdminOrders);

router.get("/admin/stats", protectAdmin, getOrderStats);
router.get("/admin/:id", protectAdmin, getAdminOrderById);

router.patch(
  "/admin/:id/status",
  protectAdmin,
  updateOrderStatus
);

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { customer, items, paymentMethod } = req.body;

    // Validate customer details.
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
    ];

    if (
      !customer ||
      requiredFields.some(
        (field) =>
          typeof customer[field] !== "string" ||
          !customer[field].trim()
      )
    ) {
      return res.status(400).json({
        error: "Please provide all required customer and delivery details.",
      });
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())
    ) {
      return res.status(400).json({
        error: "Please provide a valid email address.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Your order must contain at least one product.",
      });
    }

    if (items.length > 50) {
      return res.status(400).json({
        error: "Too many different items in one order.",
      });
    }

    if (paymentMethod !== "paystack") {
      return res.status(400).json({
        error: "Unsupported payment method.",
      });
    }

    // Validate the cart structure before querying MongoDB.
    for (const item of items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !mongoose.isValidObjectId(item.productId) ||
        typeof item.size !== "string" ||
        !item.size.trim() ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100
      ) {
        return res.status(400).json({
          error: "One or more cart items are invalid.",
        });
      }
    }

    // Combine duplicate product IDs to check stock correctly.
    const quantitiesByProduct = new Map();

    for (const item of items) {
      const id = item.productId;
      quantitiesByProduct.set(
        id,
        (quantitiesByProduct.get(id) || 0) + item.quantity
      );
    }

    const productIds = [...quantitiesByProduct.keys()];

    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    });

    const productsById = new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ])
    );

    if (products.length !== productIds.length) {
      return res.status(400).json({
        error: "One or more products are unavailable.",
      });
    }

    // Validate stock and sizes using current database values.
    for (const [id, quantity] of quantitiesByProduct) {
      const product = productsById.get(id);

      if (
        quantity > product.stock &&
        product.allowPreorder !== true
      ) {
        return res.status(400).json({
          error: `${product.name} does not have enough stock and is not accepting preorders.`,
          productId: id,
        });
      }
    }

    // Build order items from database data, never client-supplied prices.
    const orderItems = [];

    for (const item of items) {
      const product = productsById.get(item.productId);
      const size = item.size.trim();

      if (
        product.sizes.length > 0 &&
        !product.sizes.includes(size)
      ) {
        return res.status(400).json({
          error: `The selected size is unavailable for ${product.name}.`,
          productId: item.productId,
        });
      }

      orderItems.push({
        product: product._id,
        productName: product.name,
        productSlug: product.slug,
        size,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: product.price * item.quantity,
      });
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

    // Delivery is paid separately, so it is not added here.
    const order = await Order.create({
      customer: {
        name: `${customer.name.trim()}`,
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        deliveryNote:
          typeof customer.deliveryNote === "string"
            ? customer.deliveryNote.trim()
            : "",
      },
      items: orderItems,
      subtotal,
      deliveryFee: 0,
      total: subtotal,
      paymentMethod: "paystack",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    return res.status(201).json({
      message: "Order created. Payment is still pending.",
      order: {
        id: order._id,
        subtotal: order.subtotal,
        total: order.total,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Order validation failed.",
        details: error.message,
      });
    }

    return res.status(500).json({
      error: "Unable to create your order right now.",
    });
  }
});

export default router;
