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

      return decryptedData;
    });

    res.status(200).json(decryptedSupervisors);
  } catch (error) {
    console.error("Error in getAllSupervisors: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};
