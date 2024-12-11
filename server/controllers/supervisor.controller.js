import { Supervisor } from "../models/mongo/supervisor.model.js";
import {
  generateEncryptedUniqueId,
  generateKeyAndIV,
  encryptSection,
  generateHashedData,
  decryptSection,
} from "../helper/security.helper.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";
import { generatePdf } from "../helper/pdf.helper.js";
import { AzurePDFUploader } from "../helper/azure.helper.js";

export const onboardSupervisor = async (req, res, next) => {
  const {
    name,
    password,
    phone_no,
    email,
    date_of_birth,
    sex,
    preferred_language1,
    preferred_language2,
    preferred_language3,
    department,
    qualifications,
  } = req.body;

  try {
    const hashedEmail = generateHashedData(email);
    const hashedPhone = generateHashedData(phone_no);

    let findDuplicateEntries = await Supervisor.findOne({
      $or: [{ email_hash: hashedEmail }, { phone_hash: hashedPhone }],
    })
      .select("_id")
      .lean();

    if (findDuplicateEntries) {
      return res.status(400).json({ message: "user-alr-ext" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "supervisors",
    });
    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const iv = generateKeyAndIV();

    const newSupervisorId = generateEncryptedUniqueId("sup");
    const hashedSupervisorId = generateHashedData(newSupervisorId);

    const dob = new Date(date_of_birth);

    let age;
    if (!isNaN(dob.getTime())) {
      const now = new Date();
      age = now.getFullYear() - dob.getFullYear();

      const isBirthdayPassed =
        now.getMonth() > dob.getMonth() ||
        (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());

      if (!isBirthdayPassed) {
        age--;
      }
      age = `${age}`;
    } else {
      console.error("Date of Birth is not valid");
      return res.status(400).json({ message: "inv-date" });
    }

    const dataForPdf = {
      basicDetails: {
        name,
        password,
        phone_no,
        email,
        date_of_birth,
        sex,
        department,
        age,
        qualifications,
        preferred_language1,
        preferred_language2,
        preferred_language3,
      },
    };

    const pdfFileName = `${newSupervisorId}_supervisor_details.pdf`;
    await generatePdf(dataForPdf, pdfFileName);

    // Azure Storage
    const containerName = process.env.AZURE_SUPERVISOR_CONTAINER;
    const response = await AzurePDFUploader(containerName, pdfFileName);

    if (!response) return res.status(401).json({ message: "pdf-upl-err" });

    const basicDetails = {
      supervisor_id: newSupervisorId,
      name: name,
      password: password,
      phone_no: phone_no,
      email: email,
      date_of_birth: date_of_birth,
      age: age,
      sex: sex,
      department: department,
      qualifications: qualifications,
      preferred_language1: preferred_language1,
      preferred_language2: preferred_language2,
      preferred_language3: preferred_language3,
    };

    const encryptedBasicDetails = encryptSection(basicDetails, key, iv);

    const newSupervisor = new Supervisor({
      supervisor_id: encryptedBasicDetails.supervisor_id,
      name: encryptedBasicDetails.name,
      password: encryptedBasicDetails.password,
      phone_no: encryptedBasicDetails.phone_no,
      email: encryptedBasicDetails.email,
      date_of_birth: encryptedBasicDetails.date_of_birth,
      age: encryptedBasicDetails.age,
      sex: encryptedBasicDetails.sex,
      department: encryptedBasicDetails.department,
      qualifications: encryptedBasicDetails.qualifications,
      preferred_language1: encryptedBasicDetails.preferred_language1,
      preferred_language2: encryptedBasicDetails.preferred_language2,
      preferred_language3: encryptedBasicDetails.preferred_language3,
      email_hash: hashedEmail,
      phone_hash: hashedPhone,
      supervisor_id_hash: hashedSupervisorId,
      blob_storage_path: pdfFileName,
      authenticated: false,
    });

    await newSupervisor.save();

    return res.status(200).json({ message: "sup_onb_suc" });
  } catch (error) {
    console.error("Error in onboardPatient: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const getSupervisorById = async (req, res, next) => {
  const { supervisor_id } = req.params;

  try {
    const hashedSupervisorId = generateHashedData(supervisor_id);

    const supervisor = await Supervisor.findOne({
      supervisor_id_hash: hashedSupervisorId,
    });

    if (!supervisor) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "supervisors",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptData = {
      _id: supervisor._id,
      supervisor_id: Object.fromEntries(supervisor.supervisor_id),
      name: Object.fromEntries(supervisor.name),
      email: Object.fromEntries(supervisor.email),
      phone_no: Object.fromEntries(supervisor.phone_no),
      age: Object.fromEntries(supervisor.age),
      date_of_birth: Object.fromEntries(supervisor.date_of_birth),
      sex: Object.fromEntries(supervisor.sex),
      department: Object.fromEntries(supervisor.department),
      preferred_language1: Object.fromEntries(supervisor.preferred_language1),
      preferred_language2: Object.fromEntries(supervisor.preferred_language2),
      preferred_language3: Object.fromEntries(supervisor.preferred_language3),
    };

    const decryptedData = decryptSection(decryptData, key);
    decryptedData.authenticated = supervisor.authenticated;

    return res.status(200).json(decryptedData);
  } catch (error) {
    console.error("Error in getSupervisorById: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const getAllSupervisors = async (req, res, next) => {
  try {
    const supervisors = await Supervisor.find();

    if (!supervisors) {
      return res.status(400).json({ message: "sup-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "supervisors",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    let decryptedSupervisors = supervisors.map((supervisor) => {
      const decryptData = {
        _id: supervisor._id,
        supervisor_id: Object.fromEntries(supervisor.supervisor_id),
        name: Object.fromEntries(supervisor.name),
        email: Object.fromEntries(supervisor.email),
        phone_no: Object.fromEntries(supervisor.phone_no),
        age: Object.fromEntries(supervisor.age),
        date_of_birth: Object.fromEntries(supervisor.date_of_birth),
        sex: Object.fromEntries(supervisor.sex),
        department: Object.fromEntries(supervisor.department),
        preferred_language1: Object.fromEntries(supervisor.preferred_language1),
        preferred_language2: Object.fromEntries(supervisor.preferred_language2),
        preferred_language3: Object.fromEntries(supervisor.preferred_language3),
      };

      const decryptedData = decryptSection(decryptData, key);

      decryptedData.authenticated = supervisor.authenticated;
      decryptedData.allocated_therapists = supervisor.allocated_therapists;

      return decryptedData;
    });

    res.status(200).json(decryptedSupervisors);
  } catch (error) {
    console.error("Error in getAllSupervisors: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const getSupervisorByObjectId = async (req, res, next) => {
  const { supervisor_id } = req.params;

  try {
    const supervisor = await Supervisor.findById(supervisor_id);

    if (!supervisor) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "supervisors",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptData = {
      _id: supervisor._id,
      supervisor_id: Object.fromEntries(supervisor.supervisor_id),
      name: Object.fromEntries(supervisor.name),
      email: Object.fromEntries(supervisor.email),
      phone_no: Object.fromEntries(supervisor.phone_no),
      age: Object.fromEntries(supervisor.age),
      date_of_birth: Object.fromEntries(supervisor.date_of_birth),
      sex: Object.fromEntries(supervisor.sex),
      department: Object.fromEntries(supervisor.department),
      preferred_language1: Object.fromEntries(supervisor.preferred_language1),
      preferred_language2: Object.fromEntries(supervisor.preferred_language2),
      preferred_language3: Object.fromEntries(supervisor.preferred_language3),
    };

    const decryptedData = decryptSection(decryptData, key);
    decryptedData.authenticated = supervisor.authenticated;

    return res.status(200).json(decryptedData);
  } catch (error) {
    console.error("Error in getSupervisorById: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const updateSupervisor = async (req, res, next) => {
  const {
    supervisor_id,
    student_therapist_id, // New field added
    name,
    password,
    phone_no,
    email,
    date_of_birth,
    sex,
    preferred_language1,
    preferred_language2,
    preferred_language3,
    department,
    qualifications,
  } = req.body;

  try {
    // Hash the supervisor ID, email, and phone number
    const hashedSupervisorId = generateHashedData(supervisor_id);
    const hashedEmail = email ? generateHashedData(email) : undefined;
    const hashedPhone = phone_no ? generateHashedData(phone_no) : undefined;

    // Find existing supervisor record
    const existingSupervisor = await Supervisor.findOne({
      supervisor_id_hash: hashedSupervisorId,
    });

    if (!existingSupervisor) {
      return res.status(404).json({ message: "sup-not-found" });
    }

    // Check for duplicates by email or phone if they are provided
    if (hashedEmail || hashedPhone) {
      let findDuplicateEntries = await Supervisor.findOne({
        $or: [
          hashedEmail ? { email_hash: hashedEmail } : {},
          hashedPhone ? { phone_hash: hashedPhone } : {},
        ],
      }).select("_id");

      if (findDuplicateEntries) {
        return res.status(400).json({ message: "user-alr-ext" });
      }
    }

    // Get encryption key
    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "supervisors",
    });
    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const iv = generateKeyAndIV();

    // Encrypt updated supervisor details only for provided fields
    const updatedSupervisor = {};

    if (name) updatedSupervisor.name = encryptSection(name, key, iv);
    if (password)
      updatedSupervisor.password = encryptSection(password, key, iv);
    if (phone_no)
      updatedSupervisor.phone_no = encryptSection(phone_no, key, iv);
    if (email) updatedSupervisor.email = encryptSection(email, key, iv);
    if (date_of_birth)
      updatedSupervisor.date_of_birth = encryptSection(date_of_birth, key, iv);
    if (sex) updatedSupervisor.sex = encryptSection(sex, key, iv);
    if (department)
      updatedSupervisor.department = encryptSection(department, key, iv);
    if (qualifications)
      updatedSupervisor.qualifications = encryptSection(
        qualifications,
        key,
        iv
      );
    if (preferred_language1)
      updatedSupervisor.preferred_language1 = encryptSection(
        preferred_language1,
        key,
        iv
      );
    if (preferred_language2)
      updatedSupervisor.preferred_language2 = encryptSection(
        preferred_language2,
        key,
        iv
      );
    if (preferred_language3)
      updatedSupervisor.preferred_language3 = encryptSection(
        preferred_language3,
        key,
        iv
      );

    if (student_therapist_id) {
      updatedSupervisor.student_therapist_id = student_therapist_id;
    }

    // Update supervisor record with new details
    for (let field in updatedSupervisor) {
      existingSupervisor[field] = updatedSupervisor[field];
    }

    // Save updated supervisor details
    await existingSupervisor.save();

    return res.status(200).json({ message: "sup-upd-suc" });
  } catch (error) {
    console.error("Error in updateSupervisor: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};
