import express from "express";

import {
  addStudent,
  getStudentsById,
  getAllStudents,
  getStudentsByObjectId,
  updateStudent,
} from "../controllers/student-therapist.controller.js";

const router = express.Router();

router.post("/add-student", addStudent);
router.get("/get-student-by-id/:student_therapist_id", getStudentsById);
router.get(
  "/get-student-by-object-id/:student_therapist_id",
  getStudentsByObjectId
);
router.get("/get-all-students", getAllStudents);
router.put("/update-student", updateStudent);

export default router;
