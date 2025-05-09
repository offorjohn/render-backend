import getPrismaInstance from "./PrismaClient.js";
import { generateToken04 } from "./TokenGenerator.js";
import { faker } from '@faker-js/faker';

export const checkUser = async (request, response, next) => {
  try {
    const { email } = request.body;
    if (!email) {
      return response.json({ msg: "Email is required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return response.json({ msg: "User not found", status: false });
    } else
      return response.json({ msg: "User Found", status: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {3
    const id = parseInt(req.params.id);

    const prisma = getPrismaInstance();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ msg: "User not found", status: false });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ msg: "User deleted successfully", status: true });
  } catch (error) {
    next(error);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    
    // Destructure the required data from the request body
    const { email, name, profilePicture, about } = req.body;

    if (email && name) {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          profilePicture: profilePicture || '/default_avatar.png',  // Optional, default to a placeholder if not provided
          about: about || '',  // Optional, default to an empty string if not provided
        },
      });
      return res.status(201).json({ user: newUser });
    }
    return res.status(400).send("Email and name are required.");
  } catch (err) {
    next(err);
  }
};

export const addTenUsersWithCustomIds = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { startingId = 100 } = req.body;

    const arrayOfUserObjects = [];

    for (let i = 0; i < 1500; i++) {
      const id = startingId + i;
      const email = `user${id}@example.com`;
      const name = `User ${id}`;
      const profilePicture = `/avatars/${Math.floor(Math.random() * 9) + 1}.png`;

      arrayOfUserObjects.push({
        id,
        email,
        name,
        profilePicture,
        about: "Batch user",
      });
    }

    const result = await prisma.user.createMany({
      data: arrayOfUserObjects,
      skipDuplicates: true, // avoids inserting users with duplicate IDs
    });

    return res
      .status(201)
      .json({ message: ` Contacts created successfully.` });
  } catch (err) {
    next(err);
  }
};
export const deleteBatchUsers = async (req, res, next) => {
  try {
    const startId = parseInt(req.params.startId);
    const prisma = getPrismaInstance();

    const idsToDelete = Array.from({ length: 1500 }, (_, i) => startId + i);

    // First, delete all messages related to these users
    await prisma.messages.deleteMany({
      where: {
        OR: [
          { senderId: { in: idsToDelete } },
          { recieverId: { in: idsToDelete } }
        ]
      }
    });

    // Now delete the users
    const result = await prisma.user.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });

    return res.status(200).json({
      message: `Contacts deleted.`,
      deletedCount: result.count,
    });
  } catch (err) {
    next(err);
  }
};



export const addUserWithCustomId = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { id, email, name, profilePicture, about } = req.body;

    if (!id || id < 100) {
      return res.status(400).json({ msg: "ID must be provided and >= 100" });
    }

    if (!email || !name) {
      return res.status(400).json({ msg: "Email and name are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (existingUser) {
      return res.status(409).json({ msg: "User ID already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        id,
        email,
        name,
        profilePicture: profilePicture || "/default_avatar.png",
        about: about || "",
      },
    });

    return res.status(201).json({ user: newUser });
  } catch (err) {
    next(err);
  }
};



const detectIntent = (msg) => {
  const lowerMsg = msg.toLowerCase();
  if (msg.trim().endsWith("?")) return "question";
  if (lowerMsg.startsWith("can you") || lowerMsg.startsWith("please") || lowerMsg.startsWith("kindly"))
    return "request";
  if (
    lowerMsg.startsWith("announcement") ||
    lowerMsg.startsWith("attention") ||
    lowerMsg.startsWith("please note")
  )
    return "announcement";
  return "general";
};

const responseTemplates = {
  question: [
    "That's a great question. Thank you for asking.",
    "Interesting question. We'll review it.",
    "We're reviewing your inquiry. We'll get back to you with an answer.",
    "Appreciate your curiosity. Noted.",
    "Your question has been recorded. Good point, we'll look into it.",
    "We'll check and respond soon. Noted.",
    "Interesting question. Appreciate your curiosity.",
    "Good point, we'll look into it. Thank you for asking.",
    "We're reviewing your inquiry. Your question has been recorded.",
    "Appreciate your curiosity. We'll get back to you with an answer.",
    "Thanks for your question. We're looking into it now.",
    "We appreciate your insight. We'll follow up soon.",
    "Thanks for reaching out with this question.",
    "Noted. We'll circle back shortly.",
    "That's a fair point. We'll find out.",
    "Your question is being processed.",
    "We'll notify you once we have more clarity.",
    "Appreciate your thought. We’ll get back to you soon.",
    "Looking into it now. Thank you.",
    "This is being forwarded to the relevant team.",
    "We value your feedback. Thanks for the question.",
    "Excellent question. You’ll hear from us soon.",
    "Acknowledged. Stay tuned for a reply.",
    "Thanks. We'll return with the answer soon.",
    "That’s being reviewed. Appreciate your engagement.",
    "We’ve marked this as high priority.",
    "Nice catch. We'll investigate.",
    "Question recorded. Follow-up pending.",
    "Stay posted for updates.",
    "We've logged your query.",
    "Processing your input now.",
    "You’ll receive a response once confirmed.",
    "Reviewing and validating. Thanks.",
    "Our support team is checking.",
    "Escalated to team. Await feedback.",
    "You're being heard. Hang tight.",
    "Very insightful. Thanks for raising it.",
    "We’ve flagged this for attention.",
    "Thanks, we’ll return shortly.",
    "Being processed. You’ll get an update.",
    "That’s helpful. Looking into it.",
    "Appreciated. We'll let you know.",
    "In review. Thanks for submitting.",
    "Being explored. Stay with us.",
    "We’ll be back with an answer.",
    "On our radar now. Thank you.",
    "In queue for response.",
    "That’s noted. Please stand by.",
    "Recorded. Awaiting confirmation.",
    "Sent to review board.",
    "Your feedback matters. Reviewing."
  ],
  request: [
    "Sure, we'll handle that. We're working on it.",
    "Received your request. Thanks for the request.",
    "We're on it. Consider it done.",
    "Got it. We'll take action. We're working on it.",
    "We'll make it happen. Got it.",
    "Your request has been noted. Thanks for the request.",
    "We're on it. Your request has been noted.",
    "Consider it done. We're working on it.",
    "Sure, we'll handle that. Got it. We'll take action.",
    "Thanks for the request. We're working on it.",
    "Noted. Processing your request now.",
    "We'll handle this ASAP.",
    "Action initiated. Thanks for the input.",
    "We’ve received your instructions.",
    "This will be taken care of.",
    "You can count on us.",
    "Got your task. Processing.",
    "Your input has been accepted.",
    "This is being addressed.",
    "Thank you. We'll work on it.",
    "We’ll respond once it’s resolved.",
    "Currently resolving this.",
    "Steps initiated. Thanks.",
    "Under way. Please standby.",
    "It’s being reviewed now.",
    "We’ll confirm once done.",
    "Logged and prioritized.",
    "We'll take care of this.",
    "Following up promptly.",
    "Rest assured, it’s moving.",
    "Active resolution ongoing.",
    "Your input is important.",
    "Handled. Confirmation pending.",
    "That’s been initiated.",
    "Everything’s being organized.",
    "Handling request as we speak.",
    "You’ll hear back soon.",
    "Already routing for action.",
    "Quick action promised.",
    "Your concern is addressed.",
    "We’re looking after it.",
    "Resolving with care.",
    "Accepted and active.",
    "We’ve started work on this.",
    "This is in progress.",
    "Priority acknowledged.",
    "Timely follow-up ahead.",
    "On it, resolving quickly.",
    "We’ll update you soon.",
    "Just started the process."
  ],
  announcement: [
    "Announcement received. Thanks for the update.",
    "Thanks for letting us know. Broadcast understood.",
    "Update acknowledged. Thanks for the update.",
    "Your announcement has been logged. We'll act on this message.",
    "Broadcast understood. Update acknowledged.",
    "Thanks for the update. We’ve taken note of your announcement.",
    "This is now part of our records. Announcement received.",
    "We'll pass this along. Broadcast understood.",
    "Thanks for letting us know. Your announcement has been logged.",
    "Update acknowledged. We’ve taken note of your announcement.",
    "Announcement recorded successfully.",
    "Your message has been broadcast.",
    "That’s clear. Appreciated.",
    "Received and stored.",
    "Consider it shared.",
    "We’ve received the update.",
    "Public notice recorded.",
    "Internal team notified.",
    "That has been pushed out.",
    "Update made public.",
    "Everyone’s been informed.",
    "Marked as announcement.",
    "Confirmed. Thanks for alerting us.",
    "Marked as public note.",
    "Shared with all recipients.",
    "Pushed to everyone.",
    "We acknowledge your broadcast.",
    "Audience notified.",
    "Officially registered.",
    "Syndicated properly.",
    "Fed into update stream.",
    "System-wide update done.",
    "Shared to appropriate teams.",
    "Informed all stakeholders.",
    "Validated and shared.",
    "We got the announcement.",
    "Relayed to end-users.",
    "Dissemination completed.",
    "Notice saved successfully.",
    "Documented as public info.",
    "Public message archived.",
    "Storage complete.",
    "Thanks. Announced officially.",
    "Pushed to bulletin board.",
    "Alert received.",
    "Notified all ends.",
    "Flagged as broadcast.",
    "Public info recognized.",
    "Accepted as valid alert."
  ],
  general: [
    "Message received. Got your message.",
    "Thanks for your message. We’ve seen your note.",
    "We’ve logged your input. Understood.",
    "Thanks for reaching out. We appreciate the message.",
    "Understood. We’ve logged your input.",
    "We appreciate the message. Got your message.",
    "Got your message. Message received.",
    "We’ve seen your note. We’ve logged your input.",
    "Thanks for your message. Understood.",
    "Thanks for reaching out. Message received.",
    "Thanks. We’ve taken note.",
    "We acknowledge your message.",
    "Noted with thanks.",
    "This has been recorded.",
    "Glad to hear from you.",
    "Your input is valuable.",
    "Welcome input. Logged.",
    "Message added to log.",
    "We’re happy to hear from you.",
    "Thanks for letting us know.",
    "We got the note.",
    "Your thoughts are welcomed.",
    "All recorded.",
    "Warm regards. Noted.",
    "It’s on our radar.",
    "You're heard.",
    "We’ve added this to our list.",
    "Thanks, all noted.",
    "Documented accordingly.",
    "Duly noted.",
    "This is acknowledged.",
    "We see your point.",
    "Well received.",
    "Seen and accepted.",
    "Definitely noted.",
    "That’s added to the queue.",
    "It’s now part of our data.",
    "Glad you reached out.",
    "No worries, it’s here.",
    "Touchpoint established.",
    "Your entry is valued.",
    "Pleased to receive.",
    "Happy to log this.",
    "Echoed into system.",
    "We take note with care.",
    "Details understood.",
    "This has been captured.",
    "Glad to help.",
    "Received with clarity."
  ]
};

export const broadcastMessageToAll = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const prisma = getPrismaInstance();
    const SYSTEM_USER_ID = 100;

    // Ensure system user exists
    await prisma.user.upsert({
      where: { id: SYSTEM_USER_ID },
      update: {},
      create: {
        id: SYSTEM_USER_ID,
        email: "system@announcement.com",
        name: "System",
        profilePicture: "/avatars/1.png",
        about: "System message sender",
      },
    });

    // Fetch all users except the system account
    const users = await prisma.user.findMany({
      where: { id: { not: SYSTEM_USER_ID } },
      select: { id: true },
    });

    if (users.length === 0) {
      return res.status(200).json({ message: "No users to broadcast to.", status: true });
    }

    const broadcastData = [];
    const intent = detectIntent(message);
    const templates = responseTemplates[intent];

    for (let senderId = 100; senderId <= 130; senderId++) {
      for (const user of users) {
        const replyFn = faker.helpers.arrayElement(templates);
        const fakeMessage = replyFn(message);
        broadcastData.push({
          senderId,
          recieverId: user.id,
          message: fakeMessage,
        });
      }
    }

    await prisma.messages.createMany({
      data: broadcastData,
      skipDuplicates: true,
    });

    return res.status(200).json({ message: "Broadcasted", status: true });

  } catch (err) {
    console.error("Broadcast error:", err);
    next(err);
  }
};



export const onBoardUser = async (request, response, next) => {
  try {
    const {
      email,
      name,
      about = "Available",
      image: profilePicture,
    } = request.body;
    if (!email || !name || !profilePicture) {
      return response.json({
        msg: "Email, Name and Image are required",
      });
    } else {
      const prisma = getPrismaInstance();
      await prisma.user.create({
        data: { email, name, about, profilePicture },
      });
      return response.json({ msg: "Success", status: true });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
      },
    });
    const usersGroupedByInitialLetter = {};
    users.forEach((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupedByInitialLetter[initialLetter]) {
        usersGroupedByInitialLetter[initialLetter] = [];
      }
      usersGroupedByInitialLetter[initialLetter].push(user);
    });

    return res.status(200).send({ users: usersGroupedByInitialLetter });
  } catch (error) {
    next(error);
  }
};

export const generateToken = (req, res, next) => {
  try {
    const appID = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_APP_SECRET;
    const userId = req.params.userId;
    const effectiveTimeInSeconds = 3600;
    const payload = "";
    if (appID && serverSecret && userId) {
      const token = generateToken04(
        appID,
        userId,
        serverSecret,
        effectiveTimeInSeconds,
        payload
      );
      res.status(200).json({ token });
    }
    return res
      .status(400)
      .send("User id, app id and server secret is required");
  } catch (err) {
    console.log({ err });
    next(err);
  }
};
