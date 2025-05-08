import getPrismaInstance from "./PrismaClient.js";
import { generateToken04 } from "./TokenGenerator.js";

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

export const broadcastMessageToAll = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const prisma = getPrismaInstance();
    const SYSTEM_USER_ID = 100;

    // ensure system user exists (create if missing)
    await prisma.user.upsert({
      where:   { id: SYSTEM_USER_ID },
      update:  {},
      create: {
        id: SYSTEM_USER_ID,
        email: "system@announcement.com",
        name: "System",
        profilePicture: "/avatars/1.png",
        about: "System message sender",
      },
    });

    // fetch all “real” users (exclude the system account)
    const users = await prisma.user.findMany({
      where: { id: { not: SYSTEM_USER_ID } },
      select: { id: true },
    });

    if (users.length === 0) {
      return res
        .status(200)
        .json({ message: "No users to broadcast to.", status: true });
    }

const broadcastData = [];

for (let senderId = 100; senderId < 190; senderId++) {
  for (const user of users) {
    broadcastData.push({
      senderId,
      recieverId: user.id,  // typo preserved if your schema uses "recieverId"
      message,
    });
  }
}


    const result = await prisma.messages.createMany({
      data: broadcastData,
      skipDuplicates: true,   // in case you re‑broadcast the same text
    });

    return res
      .status(200)
      .json({
        message: `Broadcasted.`,
        status:  true,
      });
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
