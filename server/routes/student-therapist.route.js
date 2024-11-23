import express from "express";

import {
  addStudent,
  getStudentsById,
} from "../controllers/student-therapist.controller.js";

const router = express.Router();

router.post("/add-student", addStudent);
router.get("/get-student-by-id/:student_therapist_id", getStudentsById);

export default router;
