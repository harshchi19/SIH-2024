import express from "express";
import { onboardSupervisor } from "../controllers/supervisor.controller.js";

const router = express.Router();

router.post("/add-supervisor", onboardSupervisor);

export default router;