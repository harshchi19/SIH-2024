import { Patient } from "../models/mongo/patient.model.js";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
import { Supervisor } from "../models/mongo/supervisor.model.js";
import { decryptSection } from "../helper/security.helper.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";

export const getUnallocatedPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find({
      "medical_details.student_therapist_id": { $size: 0 },
    }).select(
      "_id patient_id name email phone_no sex user_image case_no date_of_assignment date_of_birth patient_issue preferred_language1 preferred_language2 preferred_language3"
    );

    if (!patients) return res.status(400).json({ message: "no-pat-fnd" });

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "patients",
    });
    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptedPatients = patients.map((patient) => {
      const decryptedPatient = {
        _id: patient._id,
        patient_id: Object.fromEntries(patient.patient_id),
        name: Object.fromEntries(patient.name),
        phone_no: Object.fromEntries(patient.phone_no),
        email: Object.fromEntries(patient.email),
        date_of_birth: Object.fromEntries(patient.date_of_birth),
        date_of_assignment: Object.fromEntries(patient.date_of_assignment),
        sex: Object.fromEntries(patient.sex),
        case_no: Object.fromEntries(patient.case_no),
        patient_issue: Object.fromEntries(patient.patient_issue),
        language1: Object.fromEntries(patient.preferred_language1),
        language2: Object.fromEntries(patient.preferred_language2),
        language3: Object.fromEntries(patient.preferred_language3),
      };

      const patientData = decryptSection(decryptedPatient, key);

      console.log(patientData);

      return {
        patientData,
      };
    });

    return res
      .status(200)
      .json({ message: "success", patients: decryptedPatients[0] });
  } catch (error) {
    console.error(`Error in getUnallocatedPatients: ${error}`);
    return res.status(500).json({ message: "int-ser-err" });
  }
};

export const matchPatients = async (req, res, next) => {
  const { selectedPatient, selectedTherapist, selectedSupervisor } = req.body;
  console.log(req.body);

  try {
    const existingPatient = await Patient.findById(selectedPatient);
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    existingPatient.medical_details = {
      supervisor_id: selectedSupervisor
        ? [
            ...new Set([
              ...existingPatient.medical_details.supervisor_id,
              selectedSupervisor,
            ]),
          ]
        : existingPatient.medical_details.supervisor_id,
      student_therapist_id: selectedTherapist
        ? [
            ...new Set([
              ...existingPatient.medical_details.student_therapist_id,
              selectedTherapist,
            ]),
          ]
        : existingPatient.medical_details.student_therapist_id,
    };
    await existingPatient.save();

    if (selectedTherapist) {
      const existingTherapist = await StudentTherapist.findById(
        selectedTherapist
      );
      if (!existingTherapist) {
        return res.status(404).json({ message: "Therapist not found." });
      }

      existingTherapist.supervisor_id = selectedSupervisor
        ? [...new Set([...existingTherapist.supervisor_id, selectedSupervisor])]
        : existingTherapist.supervisor_id;
      existingTherapist.patientId = [
        ...new Set([...existingTherapist.patientId, selectedPatient]),
      ];
      await existingTherapist.save();
    }

    if (selectedSupervisor) {
      const existingSupervisor = await Supervisor.findById(selectedSupervisor);
      if (!existingSupervisor) {
        return res.status(404).json({ message: "Supervisor not found." });
      }

      existingSupervisor.allocated_therapists = selectedTherapist
        ? [
            ...new Set([
              ...existingSupervisor.allocated_therapists,
              selectedTherapist,
            ]),
          ]
        : existingSupervisor.allocated_therapists;
      existingSupervisor.allocated_patients_active = [
        ...new Set([
          ...existingSupervisor.allocated_patients_active,
          selectedPatient,
        ]),
      ];
      await existingSupervisor.save();
    }

    return res.status(200).json({
      message: "Patient, therapist, and supervisor successfully matched.",
    });
  } catch (error) {
    console.error(`Error in matchPatients: ${error}`);
    return res.status(500).json({ message: "Internal server error." });
  }
};
