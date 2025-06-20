// utils/generateReplies.js
let replies = [];
let currentIndex = 0;

export const generateReplies = {
  setReplies: (newReplies) => {
    if (Array.isArray(newReplies)) {
      replies = newReplies.map(reply =>
        typeof reply === "string" ? { content: reply } : reply
      );
      currentIndex = 0;
    }
  },
  getReply: () => {
    if (!replies.length) return ["No replies set."];
    const reply = replies[currentIndex];
    currentIndex = (currentIndex + 1) % replies.length;
    return [reply.content]; // safely return the string
  },
};
