import { Router } from "express";
import { getCalendarData } from "../controllers/visualizations.controller.js";

const router = Router();

router.get("/get-calendar-data/:userId", getCalendarData);

export default router;