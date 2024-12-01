import express from "express";
import { getSidebarData, getUpcomingData } from "../controllers/sidebar.controller.js";
const router = express.Router();

router.get("/get-sidebar-data/:userType", getSidebarData);
router.get("/get-upcoming-event/:userId", getUpcomingData);

export default router;