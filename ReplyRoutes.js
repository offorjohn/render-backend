// ReplyRoutes.js
import { Router } from "express";

// Inject the reply logic
import generateReplies from "./generateReplies.js"; // Optional: if in separate file

const router = Router();

// Set replies dynamically
router.post("/set", (req, res) => {
  const { replies } = req.body;

  if (!Array.isArray(replies)) {
    return res.status(400).json({ error: "replies must be an array" });
  }

  generateReplies.setReplies(replies);
  res.json({ message: "Replies updated", count: replies.length });
});

// Get the next reply in the cycle
router.post("/get", (req, res) => {
  const { message } = req.body;
  const reply = generateReplies.getReply(message);
  res.json({ reply });
});

export default router;
