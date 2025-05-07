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

    // Create an array of IDs to delete
    const idsToDelete = Array.from({ length: 1500 }, (_, i) => startId + i);

    // Delete all users with matching IDs
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

    // 1) ensure system user exists, but we don't need its return value
    const sys = await prisma.user.findUnique({ where: { id: 0 } });
    if (!sys) {
      await prisma.user.create({
        data: {
          id: 0,
          email: "system@announcement.com",
          name: "System",
          profilePicture: "/avatars/1.png",
          about: "System message sender",
        },
      });
    }

    // 2) fetch all real users
    const users = await prisma.user.findMany({
      where: { id: { not: 0 } },
      select: { id: true },
    });

    // 3) build broadcast payload matching your Messages schema
    const broadcastData = users.map(u => ({
      senderId: 0,
      recieverId: u.id,
      message,
    }));

    // 4) bulk‐insert all messages
    const result = await prisma.messages.createMany({
      data: broadcastData,
    });

    return res.status(200).json({
      message: `Broadcasted to ${result.count} users.`,
    });
  } catch (err) {
    next(err);
  }
};



export const onBoardUser = async (request, response, next) => {
  try {
    const { email, name, about = "Available", image: profilePicture } = request.body;
    if (!email || !name || !profilePicture) {
      return response.status(400).json({ msg: "Email, Name and Image are required" });
    }

    const prisma = getPrismaInstance();

    // find current maximum id
    const lastUser = await prisma.user.findFirst({
      orderBy: { id: "desc" },
      select: { id: true },
    });
    const newId = lastUser ? lastUser.id + 1 : 100;  // start at 100 if none

    const newUser = await prisma.user.create({
      data: {
        id: newId,
        email,
        name,
        about,
        profilePicture,
      },
    });

    return response.json({ msg: "Success", status: true, data: newUser });
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
