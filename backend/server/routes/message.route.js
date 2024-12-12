import { Router } from "express";
import { getMessages } from "../controllers/message.controller.js";

const messageRoutes = Router();
messageRoutes.get("/get-messages/:user1Id/:user2Id", getMessages);

export default messageRoutes;
