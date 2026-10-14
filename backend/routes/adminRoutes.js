import express from "express";

import { adminLogin } from "../controllers/adminController.js";
import protectAdmin from "../middleware/adminauth.js";

import {
  getMessages,
  markMessageAsRead,
  deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// Existing admin login — remains public.
router.post("/login", adminLogin);

// Message management — requires a valid admin JWT.
router.get("/messages", protectAdmin, getMessages);

router.patch(
  "/messages/:id/read",
  protectAdmin,
  markMessageAsRead
);

router.delete(
  "/messages/:id",
  protectAdmin,
  deleteMessage
);

export default router;