import express from "express";
import { createMessage } from "../controllers/messageController.js";

const router = express.Router();

// Public route: customers can submit messages.
router.post("/", createMessage);

export default router;