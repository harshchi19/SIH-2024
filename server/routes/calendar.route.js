import { Router } from "express";
import { addCalendarEvent, getAllCalendarEvents, getUserObjId, updateEventById } from "../controllers/calendar.controller.js";

const router = Router();

router.post("/add-calendar-event", addCalendarEvent);
router.get("/get-calendar-events/:userId", getAllCalendarEvents);
router.get("/get-user-obj-id/:userId", getUserObjId);
router.put("/update-event", updateEventById)

export default router;