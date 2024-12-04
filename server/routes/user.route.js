import express from "express";
import { loginUser, logoutUser } from "../controllers/user.controller.js";
import { generateMasterKey } from "../controllers/keys.controller.js";

const router = express.Router();

router.post("/login-user", loginUser);
router.post("/logout-user", logoutUser);
// router.post("/register-user", registerUser);
// router.get("/get-user-by-id/:userId/:userType", getUserDetailsById);
// router.get("/generate", generateMasterKey);

export default router;
