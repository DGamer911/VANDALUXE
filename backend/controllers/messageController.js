import mongoose from "mongoose";
import Message from "../models/Messages.js";

export const createMessage = async (req, res) => {
  try {
    const { name, email, phone = "", message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    if (
      name.trim().length > 100 ||
      email.trim().length > 254 ||
      message.trim().length > 5000 ||
      typeof phone !== "string" ||
      phone.trim().length > 30
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length.",
      });
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!validEmail) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      data: newMessage,
    });
  } catch (error) {
    console.error("Create message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message. Please try again.",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load messages.",
    });
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { $set: { isRead: true, readAt: new Date() } },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Mark message as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update message.",
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete message.",
    });
  }
};