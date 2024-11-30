import { Router } from "express";
import { addCalendarEvent, getAllCalendarEvents, getUserObjId } from "../controllers/calendar.controller.js";

const router = Router();

router.post("/add-calendar-event", addCalendarEvent);
router.get("/get-calendar-events/:userId", getAllCalendarEvents);
router.get("/get-user-obj-id/:userId", getUserObjId)

export default router;