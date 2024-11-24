import express from "express";
import { getPreTherapyUserById } from "../controllers/pre_therapy.controller.js";

const router = express.Router();

router.get("/get-pre-therapy-user/:patientId", getPreTherapyUserById);


export default router;