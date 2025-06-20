import { Router } from "express";
import {
  checkUser,
  generateToken,
  
  addUser, // ✅ Add this
  getAllUsers,
  
  addTenUsersWithCustomIds, // ✅ Use actual export name
  deleteBatchUsers,         // ✅ Only if this function is also exported
  onBoardUser,
  
  deleteUser, // ✅ Add this
} from "./AuthController.js";
import { addUserWithCustomId } from "./AuthController.js";
import { broadcastMessageToAll } from "./AuthController.js";


import { setRepliesHandler } from "./RepliesController.js";



const router = Router();

router.post("/check-user", checkUser);



router.post("/set-replies", setRepliesHandler); // <-- add this line




router.post("/message/broadcast", broadcastMessageToAll);

router.post("/add-user", addUser); // ✅ Register the new route

router.post("/add-user-custom-id", addUserWithCustomId);

router.delete("/delete-user/:id", deleteUser); // ✅ Add this line

router.post("/add-batch-users", addTenUsersWithCustomIds);
router.delete("/delete-batch-users/:startId", deleteBatchUsers);
router.post("/onBoardUser", onBoardUser);
router.get("/get-contacts", getAllUsers);
router.get("/generate-token/:userId", generateToken);

export default router;


