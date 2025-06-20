import express from "express";
import { addReply, getReplies } from "./replies.js";

const router = express.Router();

router.post("/add", addReply);
router.get("/all", getReplies);

export default router;
