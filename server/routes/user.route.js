import express from "express";
import { loginUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login-user", loginUser);
// router.post("/register-user", registerUser);

export default router;
