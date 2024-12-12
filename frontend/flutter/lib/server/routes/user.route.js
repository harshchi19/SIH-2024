import express from "express";
import { loginUser, logoutUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login-user", loginUser);
router.post("/logout-user", logoutUser);
// router.post("/register-user", registerUser);

export default router;