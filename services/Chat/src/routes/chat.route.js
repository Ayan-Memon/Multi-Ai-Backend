import express from "express";
import {
  CreateConversation,
  GetConversations,
  GetMessages,
  SaveMessage,
  UpdateConversation,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/create-conversation", CreateConversation);
router.patch("/update-conversation/:id", UpdateConversation);
router.post("/send-message", SaveMessage);
router.get("/get-messages/:id", GetMessages);
router.get("/conversations", GetConversations);

export default router;
