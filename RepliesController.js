// controllers/RepliesController.js
import { PrismaClient } from "@prisma/client";
import { generateReplies } from "./generateReplies.js";

const prisma = new PrismaClient();

export const setRepliesHandler = async (req, res) => {
  try {
    const { replies } = req.body;

    if (!Array.isArray(replies) || replies.length === 0) {
      return res.status(400).json({ message: "Replies must be a non-empty array." });
    }

    // Clear existing replies
    await prisma.botReply.deleteMany();

    // Insert new replies
    const created = await prisma.botReply.createMany({
      data: replies.map((text) => ({ content: text })),
    });

    // Update the in-memory reply cache
    const updatedReplies = await prisma.botReply.findMany({ select: { content: true } });
    generateReplies.setReplies(updatedReplies);

    return res.status(200).json({
      message: "Replies updated successfully.",
      totalInserted: created.count,
    });
  } catch (err) {
    console.error("Error setting replies:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// RepliesController.js

export const getRepliesHandler = async (req, res) => {

  try {
    const replies = await prisma.botReply.findMany({
      orderBy: { id: "asc" },
    });
    res.status(200).json({ replies });
  } catch (err) {
    console.error("Failed to fetch replies:", err);
    res.status(500).json({ error: "Failed to load replies" });
  }
};

// controllers/RepliesController.js
export const updateReplyHandler = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ message: "Content must be a valid string." });
  }

  try {
    const updated = await prisma.botReply.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    return res.status(200).json({ message: "Reply updated successfully.", updated });
  } catch (err) {
    console.error("Error updating reply:", err);
    return res.status(500).json({ message: "Server error." });
  }
};


