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

    for (let i = 1; i < 1000; i++) {
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

    const idsToDelete = Array.from({ length: 1100 }, (_, i) => startId + i);

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

const generateReplies = (message) => {
  // Message patterns to detect and match the context
  const positiveReplies = [
    "Received your message, thanks!",
    "Got it, I'll take care of it.",
    "Sounds good, I'll follow up soon.",
    "Thanks for the update, I'll check it out.",
    "Got your message, will respond shortly.",
    "Noted, appreciate it!",
    "Thanks, I'll get on it right away.",
    "Perfect, I'll move forward with that.",
    "Great, I'll handle it from here.",
    "Thanks for the info, I'll look into it.",
    "Awesome, I’ll update you soon.",
    "Noted, I’ll follow up shortly.",
    "Understood, I’ll take care of that.",
    "Got it, will keep you posted.",
    "Thanks, I’ll proceed with this.",
    "Great, I’ve got all I need.",
    "Thanks, I’ll update you as soon as possible.",
    "Perfect, I’ve made a note of it.",
    "Noted, I’ll handle it as discussed.",
    "Thanks, I’ll start working on it now.",
    "Got it, everything is clear.",
    "Sounds good, let me know if you need anything.",
    "Thanks for the clarification, I’ll go ahead.",
    "Understood, I’ll make the necessary adjustments.",
    "Got it, I’ll take the next step.",
    "Thanks, I’ll make sure it’s done.",
    "Perfect, that makes sense, I’ll get to it.",
    "Got it, I’ll keep you in the loop.",
    "Thanks, I'll finalize the details.",
    "Noted, I'll be in touch soon.",
    "Okay, I’ll process that promptly.",
    "Thanks, I’ll send the update once I’m done.",
    "Understood, I’ll make the changes right away.",
    "Got it, I’ll get started on it.",
    "Perfect, I’ll let you know when it's ready.",
    "Thanks, I’ll check in with the progress soon.",
    "Sounds good, I’ll move ahead with the plan.",
    "Got it, I’ll be sure to follow up.",
    "Thanks, I’ll get back to you shortly.",
    "Understood, I’ll finish that task shortly.",
    "Perfect, I’ll get the details to you soon.",
    "Got it, I’ll make sure it’s completed.",
    "Thanks, I’ll take care of that right away.",
    "Understood, I’ll complete that ASAP.",
    "Got it, I’ll follow through on that.",
    "Sounds good, I’ll get started immediately.",
    "Thanks, I’ll update you once done.",
    "Understood, I’ll proceed accordingly.",
  ];

  const neutralReplies = [
    "Okay, noted.",
    "Understood, thanks.",
    "Alright, I'll process that now.",
    "Message received, thank you.",
    "Got it, I'll make a note of it.",
    "Noted, thanks for letting me know.",
    "Okay, I'll take care of that.",
    "Understood, will handle it shortly.",
    "Got it, I’ll check on that.",
    "Okay, I’ll look into it soon.",
    "Noted, I’ll get to it when I can.",
    "Alright, I'll follow up with that.",
    "Thanks for sharing, I’ll keep that in mind.",
    "Got it, I’ll make sure it's addressed.",
    "Okay, I'll make the change.",
    "Understood, will review that shortly.",
    "Thanks, I'll look into it soon.",
    "Okay, I’ll get started on that.",
    "Got it, I’ll handle it in due course.",
    "Alright, I’ll take care of that when possible.",
    "Noted, I’ll get back to you soon.",
    "Okay, I’ll make the necessary updates.",
    "Understood, I’ll take action on that.",
    "Got it, I’ll follow through on this.",
    "Alright, I'll update you once done.",
    "Okay, I’ll go over it.",
    "Got it, I’ll check back in soon.",
    "Thanks, I’ll make a note of it.",
    "Understood, I’ll get back to you when finished.",
    "Okay, I’ll confirm once done.",
    "Got it, I’ll proceed as needed.",
    "Alright, I’ll make those adjustments.",
    "Understood, I’ll check and update soon.",
    "Got it, I’ll keep you posted.",
    "Okay, I’ll get on it shortly.",
    "Noted, I’ll check on it and confirm.",
    "Alright, I'll make sure it's done.",
    "Got it, I’ll send an update later.",
    "Okay, I’ll follow through on that.",
    "Understood, I’ll process it when I can.",
    "Alright, I’ll take care of it after this.",
    "Got it, I’ll let you know when it’s completed.",
    "Okay, I’ll update you as soon as possible.",
    "Understood, I’ll make the change accordingly.",
    "Got it, I’ll let you know once it’s done.",
  ];

  const confusedReplies = [
    "Can you clarify that?",
    "I'm not sure I follow, could you explain?",
    "What exactly do you mean by that?",
    "Can you provide more details?",
    "I'm not sure what you're asking, can you elaborate?",
    "Can you help me understand better?",
    "Could you rephrase that?",
    "I’m not sure I understand, could you explain further?",
    "What do you mean by that exactly?",
    "I need some clarification on that.",
    "Could you provide more context?",
    "Could you explain that again?",
    "I'm not sure I follow, could you clarify?",
    "Can you give me an example?",
    "Could you break that down for me?",
    "I'm a bit confused, could you elaborate?",
    "Can you explain that in a different way?",
    "Sorry, I don’t quite understand. Could you explain?",
    "Could you elaborate a bit more on that?",
    "I’m not entirely clear on what you mean, could you clarify?",
    "Could you go over that again?",
    "I need a bit more information to follow.",
    "I’m not sure I grasp that, can you explain it differently?",
    "Could you expand on that point?",
    "Sorry, I’m a little unclear, could you rephrase?",
    "Can you provide some more examples?",
    "Could you give me a little more context?",
    "I’m not sure I’m following, could you clarify?",
    "Could you give more information about that?",
    "I don’t quite get it, could you rephrase?",
    "I’m confused, could you elaborate?",
    "Can you help me understand what you're saying?",
    "Sorry, could you go into more detail?",
    "Could you explain that part a bit more?",
    "Can you elaborate on that idea?",
    "I'm unclear on what you're saying, can you clarify?",
    "Could you be a little more specific?",
    "I'm not following, can you explain further?",
    "Could you explain what you mean by that?",
    "I'm not entirely sure what you're asking, can you clarify?",
    "Could you provide additional information on that?",
    "Can you help me understand that better?",
    "I’m having trouble following, can you clarify?",
    "Can you clarify what you mean by that point?",
    "I’m not following this part, could you explain it?",
    "I don’t quite understand, can you explain it more clearly?",
    "Can you help me make sense of that?",
  ];

  const followUpReplies = [
    "I'll check in with you soon on this.",
    "I'll get back to you once I have more info.",
    "Thanks for reaching out! I'll respond after checking in.",
    "I'll follow up with an update shortly.",
    "I'll let you know what I find out soon.",
  ];

  // Detect if the message contains a greeting (hello/hi)
  const greetings = [
    "hello",
    "hi",
    "hey",
    "greetings",
    "howdy",
    "good morning",
    "good afternoon",
    "good evening",
  ];

  const helpGreetings = [
    "how can I help",
    "how may I assist",
    "what can I do for you",
    "how can I assist",
    "is there anything I can do",
    "how can I be of help",
    "how can I support you",
    "how may I help",
    "is there something you need",
  ];

  const lowerMessage = message.toLowerCase();

  // Check if the message contains a greeting
  if (greetings.some((greeting) => lowerMessage.includes(greeting))) {
    const greetingReplies = [
      "Hello! How can I assist you today?",

      "Hi there! How may I help you?",
      "Hey! What can I do for you?",
      "Greetings! How can I be of help?",
      "Hello! How can I support you today?",
      "Hi! Is there something you need assistance with?",
      "Hey there! What’s on your mind?",
      "Hello! How can I help you today?",
      "Hello! How can I help you today?",
      "Hey! Need help with something?",
      "Greetings! What can I assist with?",
      "Hello there! How may I help?",
      "Hi! Let me know if you need anything!",
      "Hey, I’m here if you need me!",
      "Hey there! How can I be of service?",
      "Hi! What can I do for you?",
      "Greetings! How may I assist?",
      "Hello! What can I do for you today?",
      "Hey there! How can I make your day easier?",
      "Hi! What assistance do you need today?",
      "Hello, how’s your day going? How can I help?",
      "Hey! I’m here to help, what’s up?",
      "Hi! How can I assist in making things better for you?",
      "Greetings! What’s on your mind today?",
      "Hey, what can I do for you today?",
      "Hello! How may I serve you today?",
      "Hey there! Need help or guidance with something?",
      "Hi! How can I be of service to you today?",
      "Greetings! What can I support you with today?",
      "Hello! Is there something I can assist you with?",
      "Hi there! What would you like help with today?",
      "Hey! How can I be helpful today?",
      "Greetings! What do you need assistance with?",
    ];
    return [
      greetingReplies[Math.floor(Math.random() * greetingReplies.length)],
    ];
  }

  // Check if the message contains a help-related greeting
  if (helpGreetings.some((greeting) => lowerMessage.includes(greeting))) {
    const helpReplies = [
      "Hello! How can I assist you today?",
      "Hi there! How may I help you?",
      "Hey! What can I do for you?",
      "Greetings! How can I be of help?",
      "Hello! How can I support you today?",
      "Hi! Is there something you need assistance with?",
      "Hey there! What’s on your mind?",
      "Hello! How can I help you today?",
      "Hey! Need help with something?",
      "Greetings! What can I assist with?",
      "Hello there! How may I help?",
      "Hi! Let me know if you need anything!",
      "Hey, I’m here if you need me!",
      "Hey there! How can I be of service?",
      "Hi! What can I do for you?",
      "Greetings! How may I assist?",
      "Hello! What can I do for you today?",
      "Hey there! How can I make your day easier?",
      "Hi! What assistance do you need today?",
      "Hello, how’s your day going? How can I help?",
      "Hey! I’m here to help, what’s up?",
      "Hi! How can I assist in making things better for you?",
      "Greetings! What’s on your mind today?",
      "Hey, what can I do for you today?",
      "Hello! How may I serve you today?",
      "Hey there! Need help or guidance with something?",
      "Hi! How can I be of service to you today?",
      "Greetings! What can I support you with today?",
      "Hello! Is there something I can assist you with?",
      "Hi there! What would you like help with today?",
      "Hey! How can I be helpful today?",
      "Greetings! What do you need assistance with?",
      "Hello! How can I make things easier for you today?",
      "Hi! Can I help you with anything today?",
      "Hey, what do you need assistance with today?",
      "Hello! Let me know how I can assist you!",
      "Hi there! What can I do for you right now?",
      "Hey! How can I make your day better?",
      "Greetings! What can I help you with?",
      "Hello! I’m here to assist, what’s up?",
      "Hi there! Is there anything I can assist with?",
      "Hey, how can I be of service today?",
      "Hello! What would you like assistance with?",
      "Hey! Need a hand with something?",
      "Hi! How can I make things smoother for you?",
      "Greetings! What can I do to help?",
      "Hello! How may I help you out today?",
      "Hi! Let me know if there’s anything I can help with.",
      "Hey there! How’s everything going today?",
      "Hello! How can I be of assistance to you?",
      "Hi! What do you need help with today?",
      "Hey! How can I support you right now?",
      "Greetings! What assistance can I offer?",
      "Hello! I’m here to help you, what’s on your mind?",
      "Hey! I’m happy to help, what do you need?",
      "Hi there! What can I do for you today?",
      "Hello! Is there anything I can do to support you?",
      "Hey! Need any help with something today?",
      "Hi! I’m here for anything you need today.",
      "Greetings! How can I make things easier for you?",
      "Hello! What can I assist you with right now?",
      "Hi there! How can I help make things better?",
      "Hey! What’s on your mind? How can I help?",
    ];
    return [helpReplies[Math.floor(Math.random() * helpReplies.length)]];
  }

  // Detect the nature of the message (simple classification by keywords or length)
  if (
    message.includes("thank") ||
    message.includes("thanks") ||
    message.includes("thank you") ||
    message.includes("appreciate") ||
    message.includes("grateful") ||
    message.includes("thanks a lot") ||
    message.includes("thanks so much") ||
    message.includes("many thanks") ||
    message.includes("thanks again") ||
    message.includes("thanks a ton")
  ) {
    return positiveReplies;
  } else if (
    message.includes("help") ||
    message.includes("need") ||
    message.includes("assistance") ||
    message.includes("support") ||
    message.includes("could you help") ||
    message.includes("can you assist") ||
    message.includes("need help") ||
    message.includes("I don’t understand") ||
    message.includes("clarification") ||
    message.includes("can’t find") ||
    message.includes("I’m lost") ||
    message.includes("not sure")
  ) {
    return confusedReplies;
  } else if (
    message.includes("follow up") ||
    message.includes("update") ||
    message.includes("follow up on") ||
    message.includes("check in") ||
    message.includes("any progress") ||
    message.includes("status update") ||
    message.includes("how’s it going") ||
    message.includes("how are we doing") ||
    message.includes("any news") ||
    message.includes("what’s the update") ||
    message.includes("just checking in")
  ) {
    return followUpReplies;
  } else {
    return neutralReplies; // Default neutral reply
  }
};


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
