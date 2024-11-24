import {
  decryptSection,
  generateHashedData,
} from "../helper/security.helper.js";
import { Patient } from "../models/mongo/patient.model.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";
import jwt from "jsonwebtoken";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (phone, userId) => {
  return jwt.sign({ phone, userId }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

export const loginUser = async (req, res, next) => {
  const {
    userType,
    name,
    phone_no,
    password,
    supervisor_id,
    student_therapist_id,
  } = req.body;

  try {
    const hashedPhone = generateHashedData(phone_no);
    const hashedStudentTherapistId = generateHashedData(student_therapist_id);

    if (userType === "PAT") {
      const existingUser = await Patient.findOne({
        phone_hash: hashedPhone,
      }).select("patient_id password");

      if (!existingUser) {
        return res.status(400).json({ message: "usr-not-fnd" });
      }

      const findEncryptionKey = await EncryptionKey.findOne({
        collectionName: "patients",
      });
      const key = unwrapKey(
        findEncryptionKey.encryptedKey,
        findEncryptionKey.encryptedIV,
        findEncryptionKey.encryptedAuthTag
      );

      const decryptData = {
        patient_id: Object.fromEntries(existingUser.patient_id),
        password: Object.fromEntries(existingUser.password),
      };

      const decryptedData = decryptSection(decryptData, key);

      if (decryptedData.password !== password) {
        return res.status(400).json({ message: "corr-pass" });
      }

      res.cookie("token", createToken(phone_no, decryptedData.patient_id), {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24,
      });

      return res.status(200).json({
        message: "Login successful",
        userId: decryptedData.patient_id,
        userType: userType,
      });
    } else if (userType === "STT") {
      const existingUser = await StudentTherapist.findOne({
        phone_hash: hashedPhone,
        student_therapist_id_hash: hashedStudentTherapistId,
      }).select("student_therapist_id password");

      if (!existingUser) {
        return res.status(400).json({ message: "usr-not-fnd" });
      }
      console.log("Existing User:", hashedPhone);
      console.log("Existing User:", hashedStudentTherapistId);

      const findEncryptionKey = await EncryptionKey.findOne({
        collectionName: "student-therapists",
      });
      const key = unwrapKey(
        findEncryptionKey.encryptedKey,
        findEncryptionKey.encryptedIV,
        findEncryptionKey.encryptedAuthTag
      );

      const decryptData = {
        student_therapist_id: Object.fromEntries(
          existingUser.student_therapist_id
        ),
        password: Object.fromEntries(existingUser.password),
      };

      const decryptedData = decryptSection(decryptData, key);

      if (decryptedData.password !== password) {
        return res.status(400).json({ message: "corr-pass" });
      }

      res.cookie("token", createToken(phone_no, student_therapist_id), {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24,
      });

      return res.status(200).json({
        message: "Login successful",
        userId: decryptedData.student_therapist_id,
        userType: userType,
      });
    }
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({ message: "Logout Failed" });
  }
};
