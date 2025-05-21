import getPrismaInstance from "./PrismaClient.js";
import { generateToken04 } from "./TokenGenerator.js";

import { faker } from "@faker-js/faker";



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
  try {
    3;
    const id = parseInt(req.params.id);

    const prisma = getPrismaInstance();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ msg: "User not found", status: false });
    }

    await prisma.user.delete({ where: { id } });

    return res
      .status(200)
      .json({ msg: "User deleted successfully", status: true });
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
          profilePicture: profilePicture || "/default_avatar.png", // Optional, default to a placeholder if not provided
          about: about || "", // Optional, default to an empty string if not provided
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
   const startingId = 1; // to test manually


    const arrayOfUserObjects = [];

    for (let i = 1; i < 100; i++) {
      const id = startingId + i;
      const email = `user${id}@example.com`;
      const numbers = [
 "+64272270102", "+64272270305", "+64272270559", "+64272270821",
      "+64272270917", "+64272271017", "+64272271107", "+64272271261",
      "+64272271478", "+64272271550", "+64272271689", "+64272271886",
      "+64272271993", "+64272272003", "+64272272026", "+64272272106",
      "+64272272160", "+64272272267", "+64272272308", "+64272272334",
      "+64272272343", "+64272272538", "+64272272567", "+64272272773",
      "+64272272790", "+64272272872", "+64272272902", "+64272273173",
      "+64272273338", "+64272273400", "+64272273407", "+64272273770",
      "+64272273794", "+64272273882", "+64272273918", "+64272273924",
      "+64272273930", "+64272273947", "+64272273979", "+64272274022",
      "+64272274041", "+64272274143", "+64272274359", "+64272274374",
      "+64272274414", "+64272274442", "+64272274448", "+64272274494",
      "+64272274599", "+64272274610", "+64272274676", "+64272274730",
      "+64272274829", "+64272274856", "+64272275017", "+64272275039",
      "+64272275091", "+64272275095", "+64272275110", "+64272275182",
      "+64272275231", "+64272275359", "+64272275494", "+64272275523",
      "+64272275670", "+64272275769", "+64272276004", "+64272276038",
      "+64272276204", "+64272276293", "+64272276418", "+64272276657",
      "+64272276694", "+64272276752", "+64272276911", "+64272277006",
      "+64272277019", "+64272277071", "+64272277081", "+64272277099",
      "+64272277109", "+64272277131", "+64272277187", "+64272277220",
      "+64272277319", "+64272277349", "+64272277373", "+64272277391",
      "+64272277442", "+64272277460", "+64272277475", "+64272277544",
      "+64272277628", "+64272277661", "+64272277856", "+64272277979",
      "+64272278056", "+64272278080", "+64272278171", "+64272278186",
      "+64272278390", "+64272278488", "+64272278509", "+64272278754",
      "+64272278932", "+64272278968", "+64272278998", "+64272279059",
      "+64272279065", "+64272279440", "+64272279525", "+64272279548",
      "+64272279792", "+64272279999", "+64272280008", "+64272280025",
      "+64272280048", "+64272284386", "+64272284470", "+64272284487",
      "+64272284524", "+64272284559", "+64272284623", "+64272284640",
      "+64272284650", "+64272284679", "+64272284681", "+64272284711",
      "+64272284723", "+64272284964", "+64272285006", "+64272285014",
      "+64272285135", "+64272285440", "+64272285501", "+64272285525",
      "+64272285568", "+64272285629", "+64272285720", "+64272285767",
      "+64272285858", "+64272285931", "+64272285994", "+64272286022",
      "+64272286051", "+64272286053", "+64272286073", "+64272286120",
      "+64272286277", "+64272286324", "+64272286478", "+64272286522",
      "+64272286530", "+64272286557", "+64272286577", "+64272286586",
      "+64272286645", "+64272286682", "+64272286916", "+64272287019",
      "+64272287049", "+64272287059", "+64272287104", "+64272287145",
      "+64272287274", "+64272287365", "+64272287437", "+64272287617",
      "+64272287709", "+64272287714", "+64272287770", "+64272287781",
      "+64272287939", "+64272288047", "+64272288103", "+64272288105",
      "+64272288128", "+64272288222", "+64272288224", "+64272288228",
      "+64272288288", "+64272288313", "+64272288326", "+64272288338",
      "+64272288575", "+64272288604", "+64272288648", "+64272288685",
      "+64272288766", "+64272288932", "+64272289015", "+64272289082",
      "+64272289099", "+64272289179", "+64272289211", "+64272289234",
      "+64272289315", "+64272289477", "+64272289514", "+64272289562",
      "+64272289576", "+64272289668", "+64272289693", "+64272289720",
      "+64272289789", "+64272289808", "+64272289881", "+64272289914",
      "+64272289927", "+64272289960", "+64272290028", "+64272290034",
      "+64272290067", "+64272290083", "+64272290124", "+64272290224",
      "+64272290267", "+64272290303", "+64272290319", "+64272290322",
      "+64272290366", "+64272290411", "+64272290420", "+64272290435",
      "+64272290448", "+64272290588", "+64272290735", "+64272290906",
      "+64272291069", "+64272291120", "+64272291205", "+64272291335",
      "+64272291505", "+64272291533", "+64272291610", "+64272291635",
      "+64272291687", "+64272291709", "+64272291719", "+64272291789",
      "+64272291823", "+64272291955", "+64272291961", "+64272292001",
      "+64272292062", "+64272292068", "+64272292087",
];

const name = numbers[Math.floor(Math.random() * numbers.length)];


      const profilePicture = `/avatars/${Math.floor(Math.random() * 1000) + 1}.png`;


      arrayOfUserObjects.push({
        id,
        email,
        name,
        profilePicture,
        about: "",
      });
    }

    const result = await prisma.user.createMany({
      data: arrayOfUserObjects,
      skipDuplicates: true, // avoids inserting users with duplicate IDs
    });

    return res.status(201).json({ message:  'Contacts created successfully.' });
  } catch (err) {
    next(err);
  }
}; 

export const deleteBatchUsers = async (req, res, next) => {
  try {
    const startId = parseInt(req.params.startId);
    const prisma = getPrismaInstance();

    const idsToDelete = Array.from({ length: 1101 }, (_, i) => startId + i);

    // First, delete all messages related to these users
    await prisma.messages.deleteMany({
      where: {
        OR: [
          { senderId: { in: idsToDelete } },
          { recieverId: { in: idsToDelete } },
        ],
      },
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

// Sequential reply generator
const generateReplies = (() => {
  const replies = [
    "Who is this?",
    "Andy, is this you?",
    "Ok love, saved it. x",
    "Wrong number.",
    "Don't know who you are, sorry.",
    "Who've you changed to?",
    "Hi Elen, Mark just bought a new car and Mikey graduated!",
    "Hope you changed to a cheaper one — mine's $30! Haha. x",
    "Are you gone yet? What happened to your phone?",
    "Hey pal, just told about new number — any chance tonight?",
    "Chicken's in the oven. x Let me know when you come!",
    "Who is it?",
    "Which one’s this? x",
    "Got your message.",
    "Friday in Fletchers — I met this new guy. Can't wait to see you both when you're home. x Mum",
    "Hi Elle, how are you getting on? The weather’s great — I see Europe’s having storms.",
    "Hi, was just thinking about you and your travels. x",
    "Take care of yourself. Love ya.",
    "Piss off!",
    "Hi."
  ];

  let currentIndex = 0;

  return (message) => {
    // Optional: you can still classify based on message content if needed
    // For now, always return the next reply in sequence
    const reply = replies[currentIndex];
    // Increment index, wrap around
    currentIndex = (currentIndex + 1) % replies.length;
    return [reply];
  };
})();


export const broadcastMessageToAll = async (req, res, next) => {
  try {
    const { message, senderId } = req.body;
    console.log("Received message:", message);

    if (!message || !senderId) {
      console.log("Message or senderId missing.");
      return res.status(400).json({ message: "Both message and senderId are required." });
    }

    const prisma = getPrismaInstance();
    const SYSTEM_USER_ID = 100;

    // Fetch all real users (exclude system user)
    console.log("Fetching all real users...");
    const users = await prisma.user.findMany({
      where: { id: { not: SYSTEM_USER_ID } },
      select: { id: true },
    });

    if (users.length === 0) {
      console.log("No users found to broadcast to.");
      return res
        .status(200)
        .json({ message: "No users to broadcast to.", status: true });
    }

    // Step 1: Send the original message
    console.log("Broadcasting original message individually...");
    for (const user of users) {
      await prisma.messages.create({
        data: {
          senderId: senderId, // From request
          recieverId: user.id,
          message: message,
        },
      });
    }

    // Step 2: Send random replies from bot/system user range
   console.log("Broadcasting random replies in bulk…");

// 1) Build up a flat array of all the rows you want to insert
const allMessages = [];

for (let replySenderId = 3; replySenderId <= 20; replySenderId++) {
  for (const user of users) {
    const randomReplies  = generateReplies(message);
    const randomReply    = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    allMessages.push({
      senderId:   replySenderId,
      recieverId: user.id,
      message:    randomReply,
    });
  }
}

// 2) Chunk it so you don’t blow up your DB in a single giant call
const CHUNK_SIZE = 13;
for (let i = 0; i < allMessages.length; i += CHUNK_SIZE) {
  const chunk = allMessages.slice(i, i + CHUNK_SIZE);
  // you can pass skipDuplicates: true if you want to ignore unique‐constraint errors
  await prisma.messages.createMany({
    data:           chunk,
    skipDuplicates: false,
  });
}

console.log(`Inserted ${allMessages.length} messages in ${Math.ceil(allMessages.length / CHUNK_SIZE)} batch(es).`);


    console.log("All messages sent individually.");
    return res.status(200).json({ message: "Broadcasted.", status: true });
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
