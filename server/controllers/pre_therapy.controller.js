import {
  decryptSection,
  encryptSection,
  generateHashedData,
  generateKeyAndIV,
} from "../helper/security.helper.js";
import { Patient } from "../models/mongo/patient.model.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { PreTherapy } from "../models/mongo/pre_therapy.model.js";
import { unwrapKey } from "./keys.controller.js";

export const getPreTherapyUserById = async (req, res, next) => {
  const { patientId } = req.params;

  try {
    if (!patientId) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPatientId = generateHashedData(patientId);
    const patientData = await Patient.findOne({
      patient_id_hash: hashedPatientId,
    }).select("_id");

    const existingEntry = await PreTherapy.findOne({
      patient_id: patientData,
    }).select("_id");

    if (existingEntry) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error("Error in getPreTherapyUserById: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const uploadPreTherapy = async (req, res, next) => {
  const { patientDetails, findings } = req.body;

  try {
    const hashedCaseNo = generateHashedData(patientDetails.case_no);
    const existingEntry = await PreTherapy.findOne({
      case_no_hash: hashedCaseNo,
    }).select("_id");

    if (existingEntry) {
      return res.status(400).json({ message: "usr-alr-ext" });
    }

    const existingPatient = await Patient.findOne({
      case_no_hash: hashedCaseNo,
    }).select("name age sex date_of_assignment");

    if (!existingPatient) {
      return res.status(400).json({ message: "pat-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "patients",
    });
    let key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const patientData = {
      _id: existingPatient._id,
      name: Object.fromEntries(existingPatient.name),
      age: Object.fromEntries(existingPatient.age),
      sex: Object.fromEntries(existingPatient.sex),
      date_of_assignment: Object.fromEntries(
        existingPatient.date_of_assignment
      ),
    };

    const decryptedData = decryptSection(patientData, key);

    const encryptPatientDetails = {
      case_no: patientDetails.case_no,
      name: decryptedData.name,
      age: decryptedData.age,
      sex: decryptedData.sex,
      date_of_assignment: decryptedData.date_of_assignment,
      provisional_diagnosis: patientDetails.provisional_diagnosis,
      supervisor: patientDetails.supervisor,
      student_clinician: patientDetails.student_clinician,
    };

    const newEncryptionKey = await EncryptionKey.findOne({
      collectionName: "pre_therapys",
    });
    key = unwrapKey(
      newEncryptionKey.encryptedKey,
      newEncryptionKey.encryptedIV,
      newEncryptionKey.encryptedAuthTag
    );
    const iv = generateKeyAndIV();

    const encryptedPatientDetails = encryptSection(
      encryptPatientDetails,
      key,
      iv
    );
    const encryptedFindings = encryptSection(findings, key, iv);

    const newPreTherapy = new PreTherapy({
      patient_id: patientData._id,
      case_no: encryptedPatientDetails.case_no,
      name: encryptedPatientDetails.name,
      age: encryptedPatientDetails.age,
      sex: encryptedPatientDetails.sex,
      date_of_assignment: encryptedPatientDetails.date_of_assignment,
      provisional_diagnosis: encryptedPatientDetails.provisional_diagnosis,
      supervisor: encryptedPatientDetails.supervisor,
      student_therapist: encryptedPatientDetails.student_clinician,
      case_no_hash: hashedCaseNo,
      findings: encryptedFindings,
    });

    newPreTherapy.save();

    return res.status(200).json({ message: "wait-sup-conf", success: true });
  } catch (error) {
    console.error("Error in uploadPreTherapy: ", error);
    return res.status(500).json({ message: "int-ser-err" });
  }
};
