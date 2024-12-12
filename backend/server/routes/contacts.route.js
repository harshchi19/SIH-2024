import { Router } from "express";
// import { verifyToken } from "../middlewares/auth.middleware.js";
import { getContacts } from "../controllers/contacts.controller.js";

const contactRoutes = Router();

contactRoutes.get("/get-contacts/:userId", getContacts);

export default contactRoutes;
