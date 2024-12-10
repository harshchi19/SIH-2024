import express from "express";

import {
  addStudent,
  getStudentsById,
  getAllStudents,
  getStudentsByObjectId,
} from "../controllers/student-therapist.controller.js";

const router = express.Router();

router.post("/add-student", addStudent);
router.get("/get-student-by-id/:student_therapist_id", getStudentsById);
router.get(
  "/get-student-by-object-id/:student_therapist_id",
  getStudentsByObjectId
);
router.get("/get-all-students", getAllStudents);

export default router;
