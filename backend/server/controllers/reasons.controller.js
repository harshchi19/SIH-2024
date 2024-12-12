import { Patient } from "../models/mongo/patient.model.js";
import { Reasons } from "../models/mongo/reasons.model.js";

export const terminatePatient = async (req, res, next) => {
  const {
    patient_id,
    case_no,
    reason,
    actionBy,
    actionByUserType,
    actionType,
  } = req.body;

  try {
    if (!patient_id || !case_no || !actionBy || !actionType || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const terminationRecord = new Reasons({
      patient_id,
      case_no,
      actionBy,
      actionByUserType,
      actionType,
      reason,
    });

    const existingPatient = await Patient.findById(patient_id);
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    existingPatient.patient_status = "TERMINATED";
    await existingPatient.save();

    await terminationRecord.save();

    return res.status(200).json({ message: "Patient has been terminated" });
  } catch (error) {
    console.error(`Error in terminatePatient: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const transferPatient = async (req, res, next) => {
  const {
    patient_id,
    case_no,
    reason,
    actionBy,
    actionByUserType,
    actionType,
  } = req.body;

  try {
    if (!patient_id || !case_no || !actionBy || !actionType || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transferRecord = new Reasons({
      patient_id,
      case_no,
      actionBy,
      actionByUserType,
      actionType,
      reason,
    });

    console.log(transferRecord);

    const existingPatient = await Patient.findById(patient_id);
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    existingPatient.medical_details = {
      ...existingPatient.medical_details,
      supervisor_id: [],
      student_therapist_id: [],
    };

    await existingPatient.save();
    await transferRecord.save();

    return res
      .status(200)
      .json({ message: "Patient is now open for adding a new therapist" });
  } catch (error) {
    console.error(`Error in transferPatient: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
