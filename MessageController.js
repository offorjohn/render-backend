import { renameSync } from "fs";
import getPrismaInstance from "./PrismaClient.js";

export const getMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { from, to } = req.params;
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(from),
            recieverId: parseInt(to),
          },
          {
            senderId: parseInt(to),
            recieverId: parseInt(from),
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });
    const unreadMessages = [];

    messages.forEach((message, index) => {
      if (
        message.messageStatus !== "read" &&
        message.senderId === parseInt(to)
      ) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });

    await prisma.messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: {
        messageStatus: "read",
      },
    });
    res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();

    const { message, from, to } = req.body;
    const getUser = onlineUsers.get(to);

    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message: message,
          sender: { connect: { id: parseInt(from) } },
          reciever: { connect: { id: parseInt(to) } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, reciever: true },
      });
      return res.status(201).send({ message: newMessage });
    }
    return res.status(400).send("From, to and Message is required.");
  } catch (err) {
    next(err);
  }
};

export const broadcastMessageToAll = async (req, res, next) => {
  try {
    const { message, senderId } = req.body;
    if (!message || !senderId) {
      return res.status(400).json({
        message: "Both message and senderId are required."
      });
    }

    const prisma = getPrismaInstance();
    const io = req.app.locals.io;
    const SYSTEM_USER_ID = 100;

    // 1) Get all real users
    const users = await prisma.user.findMany({
      where: { id: { not: SYSTEM_USER_ID } },
      select: { id: true }
    });

    if (users.length === 0) {
      return res.status(200).json({
        message: "No users to broadcast to.",
        status: true
      });
    }

    // 2) Prepare data for the original broadcast
    const broadcastRecords = users.map(u => ({
      senderId,
      recieverId: u.id,
      message
    }));

    // 3) Prepare data for system replies
    const systemRepliesRecords = [];
    for (let botId = 101; botId <= 110; botId++) {
      for (const u of users) {
        const replies = generateReplies(message);
        const replyText = replies[Math.floor(Math.random() * replies.length)];
        systemRepliesRecords.push({
          senderId: botId,
          recieverId: u.id,
          message: replyText
        });
      }
    }

    // 4) Bulk insert everything
    await prisma.messages.createMany({
      data: [...broadcastRecords, ...systemRepliesRecords]
    });

    // 5) Emit each record over Socket.IO
    //    so any connected client with that userId will immediately get it
    for (const rec of broadcastRecords) {
      const sockId = global.onlineUsers.get(rec.recieverId);
      if (sockId) {
        io.to(sockId).emit("msg-receive", {
          from: rec.senderId,
          message: rec.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    for (const rec of systemRepliesRecords) {
      const sockId = global.onlineUsers.get(rec.recieverId);
      if (sockId) {
        io.to(sockId).emit("msg-receive", {
          from: rec.senderId,
          message: rec.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    return res.status(200).json({
      message: "Broadcasted in real time.",
      status: true
    });
  } catch (err) {
    console.error("Broadcast error:", err);
    next(err);
  }
};

export const getInitialContactsWithMessages = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.from);
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentMessages: {
          include: { reciever: true, sender: true },
          orderBy: { createdAt: "desc" },
        },
        recievedMessages: {
          include: { reciever: true, sender: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    const messages = [...user.sentMessages, ...user.recievedMessages];
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const calculatedId = isSender ? msg.recieverId : msg.senderId;
      if (msg.messageStatus === "sent") {
        messageStatusChange.push(msg.id);
      }
      if (!users.get(calculatedId)) {
        const {
          id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          recieverId,
        } = msg;
        let user = {
          messageId: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          recieverId,
        };
        if (isSender) {
          user = {
            ...user,
            ...msg.reciever,
            totalUnreadMessages: 0,
          };
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
          };
        }
        users.set(calculatedId, {
          ...user,
        });
      } else if (msg.messageStatus !== "read" && !isSender) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    if (messageStatusChange.length) {
      await prisma.messages.updateMany({
        where: {
          id: { in: messageStatusChange },
        },
        data: {
          messageStatus: "delivered",
        },
      });
    }

    return res.status(200).json({
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  } catch (err) {
    next(err);
  }
};

export const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/recordings/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            reciever: { connect: { id: parseInt(to) } },
            type: "audio",
          },
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From, to is required.");
    }
    return res.status(400).send("Audio is required.");
  } catch (err) {
    next(err);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/images/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            reciever: { connect: { id: parseInt(to) } },
            type: "image",
          },
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From, to is required.");
    }
    return res.status(400).send("Image is required.");
  } catch (err) {
    next(err);
  }
};
