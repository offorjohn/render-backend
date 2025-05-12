import { Router } from "express";
import {
  checkUser,
  generateToken,
  addUser,
  addUserWithCustomId,
  getAllUsers,
  addTenUsersWithCustomIds,
  deleteBatchUsers,
  onBoardUser,
  deleteUser,
  broadcastMessageToAll,
} from "./AuthController.js";

// new:
import { authenticateToken } from "./authenticateToken.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/add-user", addUser);
router.post("/add-user-custom-id", addUserWithCustomId);
router.delete("/delete-user/:id", deleteUser);
router.post("/add-batch-users", addTenUsersWithCustomIds);
router.delete("/delete-batch-users/:startId", deleteBatchUsers);
router.post("/onBoardUser", onBoardUser);
router.get("/get-contacts", getAllUsers);
router.get("/generate-token/:userId", generateToken);

// <-- REVISED broadcast route: no email in body!
router.post(
  "/message/broadcast",
  authenticateToken,         // authenticate and set req.userId
  broadcastMessageToAll      // uses only req.userId + { message }
);

export default router;
