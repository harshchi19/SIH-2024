import express from "express";
import {
  generateReport,
  //   getReportById,
  getAllReports,
} from "../controllers/report.controller.js";

const router = express.Router();

router.post("/generate-report", generateReport);
router.get("/get-all-reports", getAllReports);

export default router;
