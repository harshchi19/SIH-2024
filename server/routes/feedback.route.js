import express from "express";

import {
  addFeedback,
  getFeedback,
} from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/add-feedback", addFeedback);
router.get("/get-feedback", getFeedback);

export default router;
