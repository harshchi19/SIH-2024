import express from "express";
import { getPreTherapyUserById, uploadPreTherapy } from "../controllers/pre_therapy.controller.js";

const router = express.Router();

router.get("/get-pre-therapy-user/:patientId", getPreTherapyUserById);
router.post("/upload-pre-therapy", uploadPreTherapy);
router.post("/matchmaking");

export default router;