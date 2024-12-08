import { Patient } from "../models/mongo/patient.model.js";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
import { Supervisor } from "../models/mongo/supervisor.model.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";
import {
  decryptSection,
  generateHashedData,
} from "../helper/security.helper.js";
import { Messages } from "../models/mongo/message.model.js";

export const getContacts = async (req, res) => {
  let { userId } = req.params;
  try {
    userId = userId.replace(/"/g, "");

    const userType = userId.split("-")[0];

    const collectionNames = getCollectionName(userType);

    const encryptionKeys = {};
    for (const collection of collectionNames) {
      const encryptionKey = await EncryptionKey.findOne({
        collectionName: collection,
      });

      if (!encryptionKey) {
        return res
          .status(500)
          .json({ message: `Encryption key not found for ${collection}` });
      }

      encryptionKeys[collection] = unwrapKey(
        encryptionKey.encryptedKey,
        encryptionKey.encryptedIV,
        encryptionKey.encryptedAuthTag
      );
    }

    let contacts = {};

    if (userType === "SUP") {
      contacts = await getSupervisorContacts(userId, encryptionKeys);
    } else if (userType === "STT") {
      contacts = await getStudentTherapistContacts(userId, encryptionKeys);
    } else if (userType === "PAT") {
      contacts = await getPatientContacts(userId, encryptionKeys);
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }
    // console.log("contacts being returned:", contacts);
    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getCollectionName = (userType) => {
  switch (userType) {
    case "SUP":
      return ["supervisors", "student-therapists"];
    case "PAT":
      return ["student-therapists", "patients"];
    case "STT":
      return ["student-therapists", "patients", "supervisors"];
    default:
      return [];
  }
};

// Fetch and decrypt contacts for Supervisors (supervisors and student therapists only)
const getSupervisorContacts = async (currentUserId, encryptionKeys) => {
  const currentIdHash = generateHashedData(currentUserId);
  const supervisors = await Supervisor.find({
    supervisor_id_hash: { $ne: currentIdHash },
  }).select("supervisor_id name -_id");

  const studentTherapists = await StudentTherapist.find().select(
    "student_therapist_id name -_id"
  );

  const decryptedSupervisors = supervisors.map((supervisor) => {
    const decryptData = {
      supervisor_id: Object.fromEntries(supervisor.supervisor_id),
      name: Object.fromEntries(supervisor.name),
    };

    return decryptSection(decryptData, encryptionKeys["supervisors"]);
  });

  const decryptedTherapists = studentTherapists.map((therapist) => {
    const decryptData = {
      student_therapist_id: Object.fromEntries(therapist.student_therapist_id),
      name: Object.fromEntries(therapist.name),
    };
    return decryptSection(decryptData, encryptionKeys["student-therapists"]);
  });
  return {
    supervisors: decryptedSupervisors,
    therapists: decryptedTherapists,
    patients: [],
  };
};

const getStudentTherapistContacts = async (currentUserId, encryptionKeys) => {
  const currentIdHash = generateHashedData(currentUserId);
  const supervisors = await Supervisor.find().select("supervisor_id name -_id");
  const patients = await Patient.find().select("patient_id name -_id");
  const studentTherapists = await StudentTherapist.find({
    student_therapist_id_hash: { $ne: currentIdHash },
  }).select("student_therapist_id name -_id");

  const decryptedTherapists = studentTherapists.map((therapist) => {
    const decryptData = {
      student_therapist_id: Object.fromEntries(therapist.student_therapist_id),
      name: Object.fromEntries(therapist.name),
    };
    return decryptSection(decryptData, encryptionKeys["student-therapists"]);
  });

  // Handle Supervisor Decryption
  const decryptedSupervisors = supervisors.map((supervisor) => {
    const decryptData = {
      supervisor_id: Object.fromEntries(supervisor.supervisor_id),
      name: Object.fromEntries(supervisor.name),
    };

    return decryptSection(decryptData, encryptionKeys["supervisors"]);
  });

  const decryptedPatients = patients.map((patient) => {
    const decryptData = {
      patient_id: Object.fromEntries(patient.patient_id),
      name: Object.fromEntries(patient.name),
    };
    return decryptSection(decryptData, encryptionKeys["patients"]);
  });

  return {
    supervisors: decryptedSupervisors,
    therapists: decryptedTherapists,
    patients: decryptedPatients,
  };
};

// Fetch and decrypt only Student Therapists for Patients
const getPatientContacts = async (currentUserId, encryptionKeys) => {
  const studentTherapists = await StudentTherapist.find().select(
    "student_therapist_id name -_id"
  );

  const decryptedTherapists = studentTherapists.map((therapist) => {
    const decryptData = {
      student_therapist_id: Object.fromEntries(therapist.student_therapist_id),
      name: Object.fromEntries(therapist.name),
    };
    return decryptSection(decryptData, encryptionKeys["student-therapists"]);
  });
  return {
    supervisors: [],
    therapists: decryptedTherapists,
  };
};
