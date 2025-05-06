// AuthController.js
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this!";

// ─── in‑memory user store ────────────────────────────────────────────────────
const users = [
  { id: "1", username: "alice",   password: "wonderland" },
  { id: "2", username: "bob",     password: "builder"    },
  { id: "3", username: "charlie", password: "chocolate"  },
];

// POST /api/auth/check-user
export const checkUser = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // return the user object (omit password in production)
  res.json({ id: user.id, username: user.username });
};

// POST /api/auth/onBoardUser
export const onBoardUser = (req, res) => {
  const { username, password } = req.body;
  if (users.some(u => u.username === username)) {
    return res.status(409).json({ error: "Username already taken" });
  }
  const newUser = { id: uuidv4(), username, password };
  users.push(newUser);
  // return the created user (omit password)
  res.status(201).json({ id: newUser.id, username: newUser.username });
};

// GET  /api/auth/get-contacts
export const getAllUsers = (_req, res) => {
  // in a real app you’d filter out sensitive fields
  const publicUsers = users.map(u => ({ id: u.id, username: u.username }));
  res.json(publicUsers);
};

// GET  /api/auth/generate-token/:userId
export const generateToken = (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "4h" }
  );
  res.json({ token });
};
