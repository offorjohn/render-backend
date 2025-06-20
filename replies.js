// controllers/replies.js
export const addReply = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Reply content is required." });

    const prisma = getPrismaInstance();
    const newReply = await prisma.botReply.create({
      data: { content },
    });

    res.status(201).json({ reply: newReply });
  } catch (err) {
    console.error("Add reply error:", err);
    next(err);
  }
};
export const getReplies = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const replies = await prisma.botReply.findMany({ orderBy: { id: "asc" } });
    res.status(200).json({ replies });
  } catch (err) {
    console.error("Get replies error:", err);
    next(err);
  }
};
