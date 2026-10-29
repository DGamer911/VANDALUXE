import mongoose from "mongoose";
import Order from "../models/Order.js";

// GET /api/orders/admin/all
// Retrieve real orders for the admin.
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get admin orders error:", error);

    return res.status(500).json({
      error: "Unable to retrieve orders.",
    });
  }
};
/**
 * GET /api/orders/admin/:id
 * Retrieve one order for the admin order-details page.
 */
export const getAdminOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Invalid order ID.",
      });
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Get admin order details error:", error);

    return res.status(500).json({
      error: "Unable to retrieve order details.",
    });
  }
};

// GET /api/orders/admin/stats
// Calculate dashboard statistics from MongoDB.
export const getOrderStats = async (req, res) => {
  try {
    const [
      totalOrders,
      paidOrders,
      pendingOrders,
      deliveredOrders,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: "paid" }),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return res.status(200).json({
      totalOrders,
      paidOrders,
      pendingOrders,
      deliveredOrders,
      recentOrders,
    });
  } catch (error) {
    console.error("Get order stats error:", error);

    return res.status(500).json({
      error: "Unable to retrieve order statistics.",
    });
  }
};

// PATCH /api/orders/admin/:id/status
// Update the fulfilment status of an order.
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Invalid order ID.",
      });
    }

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        error: "Invalid order status.",
        allowedStatuses,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { orderStatus } },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      error: "Unable to update order status.",
    });
  }
};