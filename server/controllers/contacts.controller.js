// import { Patient } from "../models/mongo/patient.model.js";
import { Admin } from "../models/mongo/admin.model.js";
import { HeadOfDepartment } from "../models/mongo/hod.model.js";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
import { Supervisor } from "../models/mongo/supervisor.model.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";
import {
  decryptSection,
  generateHashedData,
} from "../helper/security.helper.js";

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
    } else if (userType === "ADM") {
      contacts = await getAdminContacts(userId, encryptionKeys);
    } else if (userType === "HOD") {
      contacts = await getHODContacts(userId, encryptionKeys);
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getCollectionName = (userType) => {
  switch (userType) {
    case "SUP":
      return ["supervisors", "student-therapists", "admins", "hods"];
    case "STT":
      return ["student-therapists", "supervisors", "admins", "hods"];
    case "ADM":
      return ["admins", "student-therapists", "supervisors", "hods"];
    case "HOD":
      return ["hods", "student-therapists", "supervisors", "admins"];
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
  const admins = await Admin.find().select("admin_id name -_id");
  const hods = await HeadOfDepartment.find().select("hod_id name -_id");

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

  const decryptedAdmins = admins.map((admin) => {
    const decryptData = {
      admin_id: Object.fromEntries(admin.admin_id),
      name: Object.fromEntries(admin.name),
    };
    return decryptSection(decryptData, encryptionKeys["admins"]);
  });

  const decryptedHODs = hods.map((hod) => {
    const decryptData = {
      hod_id: Object.fromEntries(hod.hod_id),
      name: Object.fromEntries(hod.name),
    };
    return decryptSection(decryptData, encryptionKeys["hods"]);
  });
  return {
    supervisors: decryptedSupervisors,
    therapists: decryptedTherapists,
    admins: decryptedAdmins,
    hods: decryptedHODs,
  };
};

const getStudentTherapistContacts = async (currentUserId, encryptionKeys) => {
  const currentIdHash = generateHashedData(currentUserId);
  const supervisors = await Supervisor.find().select("supervisor_id name -_id");
  const studentTherapists = await StudentTherapist.find({
    student_therapist_id_hash: { $ne: currentIdHash },
  }).select("student_therapist_id name -_id");
  const admins = await Admin.find().select("admin_id name -_id");
  const hods = await HeadOfDepartment.find().select("hod_id name -_id");
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
  const decryptedAdmins = admins.map((admin) => {
    const decryptData = {
      admin_id: Object.fromEntries(admin.admin_id),
      name: Object.fromEntries(admin.name),
    };
    return decryptSection(decryptData, encryptionKeys["admins"]);
  });

  const decryptedHODs = hods.map((hod) => {
    const decryptData = {
      hod_id: Object.fromEntries(hod.hod_id),
      name: Object.fromEntries(hod.name),
    };
    return decryptSection(decryptData, encryptionKeys["hods"]);
  });

  return {
    supervisors: decryptedSupervisors,
    therapists: decryptedTherapists,
    admins: decryptedAdmins,
    hods: decryptedHODs,
  };
};

//Admin
const getAdminContacts = async (currentUserId, encryptionKeys) => {
  const currentIdHash = generateHashedData(currentUserId);
  const supervisors = await Supervisor.find().select("supervisor_id name -_id");
  const admins = await Admin.find({
    admin_id_hash: { $ne: currentIdHash },
  }).select("admin_id name -_id");
  const studentTherapists = await StudentTherapist.find().select(
    "student_therapist_id name -_id"
  );
  const hods = await HeadOfDepartment.find().select("hod_id name -_id");
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
  const decryptedAdmins = admins.map((admin) => {
    const decryptData = {
      admin_id: Object.fromEntries(admin.admin_id),
      name: Object.fromEntries(admin.name),
    };
    return decryptSection(decryptData, encryptionKeys["admins"]);
  });

  const decryptedHODs = hods.map((hod) => {
    const decryptData = {
      hod_id: Object.fromEntries(hod.hod_id),
      name: Object.fromEntries(hod.name),
    };
    return decryptSection(decryptData, encryptionKeys["hods"]);
  });

  return {
    admins: decryptedAdmins,
    supervisors: decryptedSupervisors,
    therapists: decryptedTherapists,
    hods: decryptedHODs,
  };
};

const getHODContacts = async (currentUserId, encryptionKeys) => {
  const currentIdHash = generateHashedData(currentUserId);
  const supervisors = await Supervisor.find().select("supervisor_id name -_id");
  const hods = await HeadOfDepartment.find({
    hash_hod_id: { $ne: currentIdHash },
  }).select("admin_id name -_id");
  const studentTherapists = await Supervisor.find().select(
    "student_therapist_id name -_id"
  );
  const admins = await Admin.find().select("admin_id name -_id");
  const decryptedTherapists = studentTherapists.map((therapist) => {
    const decryptData = {
      student_therapist_id: Object.fromEntries(therapist.student_therapist_id),
      name: Object.fromEntries(therapist.name),
    };
    return decryptSection(decryptData, encryptionKeys["admin"]);
  });

  // Handle Supervisor Decryption
  const decryptedSupervisors = supervisors.map((supervisor) => {
    const decryptData = {
      supervisor_id: Object.fromEntries(supervisor.supervisor_id),
      name: Object.fromEntries(supervisor.name),
    };

    return decryptSection(decryptData, encryptionKeys["supervisors"]);
  });
  const decryptedAdmins = admins.map((admin) => {
    const decryptData = {
      admin_id: Object.fromEntries(admin.admin_id),
      name: Object.fromEntries(admin.name),
    };
    return decryptSection(decryptData, encryptionKeys["admins"]);
  });

  const decryptedHODs = hods.map((hod) => {
    const decryptData = {
      hod_id: Object.fromEntries(hod.hod_id),
      name: Object.fromEntries(hod.name),
    };
    return decryptSection(decryptData, encryptionKeys["hods"]);
  });

  return {
    admins: decryptedAdmins,
    supervisors: decryptedSupervisors,
    therapists: decryptedTherapists,
    hods: decryptedHODs,
  };
};
