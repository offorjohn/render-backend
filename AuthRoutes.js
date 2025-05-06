import { Router } from "express";
import {
  checkUser,
  generateToken,
  
  addUser, // ✅ Add this
  getAllUsers,
  onBoardUser,
  
  deleteUser, // ✅ Add this
} from "./AuthController.js";
import { addUserWithCustomId } from "./AuthController.js";

const router = Router();

router.post("/check-user", checkUser);

router.post("/add-user", addUser); // ✅ Register the new route

router.post("/add-user-custom-id", addUserWithCustomId);

router.delete("/delete-user/:id", deleteUser); // ✅ Add this line
router.post("/onBoardUser", onBoardUser);
router.get("/get-contacts", getAllUsers);
router.get("/generate-token/:userId", generateToken);

export default router;