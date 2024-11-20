import express from "express";
import { getSidebarData } from "../controllers/sidebar.controller.js";
const router = express.Router();

router.get("/get-sidebar-data", getSidebarData);

export default router;