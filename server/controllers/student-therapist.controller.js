import {
  decryptSection,
  encryptSection,
  generateEncryptedUniqueId,
  generateHashedData,
  generateKeyAndIV,
} from "../helper/security.helper.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
import { unwrapKey } from "./keys.controller.js";
import { Supervisor } from "../models/mongo/supervisor.model.js";
import { AzurePDFUploader } from "../helper/azure.helper.js";

export const addStudent = async (req, res) => {
  const { personalDetails, professionalDetails } = req.body;

  try {
    const hashedEmail = generateHashedData(personalDetails.email);
    const hashedPhone = generateHashedData(personalDetails.phone_no);

    const { location, ...updatedProfessionalDetails } = professionalDetails;

    let findDuplicateEntries = await StudentTherapist.findOne({
      $or: [{ email_hash: hashedEmail }, { phone_hash: hashedPhone }],
    }).select("_id");

    if (findDuplicateEntries) {
      return res.status(400).json({ message: "user-alr-ext" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "student-therapists",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const iv = generateKeyAndIV();

    const newStudentTherapistId = generateEncryptedUniqueId("stt");
    personalDetails["student_therapist_id"] = newStudentTherapistId;

    const hashedStudentTherapistId = generateHashedData(newStudentTherapistId);

    const student = {
      personalDetails,
      professionalDetails,
      location,
    };

    const pdfFileName = `${newStudentTherapistId}_supervisor_details.pdf`;
    await generatePdf(dataForPdf, pdfFileName);

    // Azure Storage
    const containerName = process.env.AZURE_THERAPIST_CONTAINER;
    const response = await AzurePDFUploader(containerName, pdfFileName);

    if (!response) return res.status(401).json({ message: "pdf-upl-err" });

    const encryptedPersonalDetails = encryptSection(personalDetails, key, iv);
    const encryptedProfessionalDetails = encryptSection(
      updatedProfessionalDetails,
      key,
      iv
    );
    const encryptedAddressDetails = encryptSection(location, key, iv);

    const newStudentTherapist = new StudentTherapist({
      supervisor_id: personalDetails.supervisor_id,
      student_therapist_id: encryptedPersonalDetails.student_therapist_id,
      student_image: encryptedPersonalDetails.student_image,
      name: encryptedPersonalDetails.name,
      password: encryptedPersonalDetails.password,
      email: encryptedPersonalDetails.email,
      phone_no: encryptedPersonalDetails.phone_no,
      age: encryptedPersonalDetails.age,
      sex: encryptedPersonalDetails.sex,
      preferred_language1: encryptedProfessionalDetails.preferred_language1,
      preferred_language2: encryptedProfessionalDetails.preferred_language2,
      preferred_language3: encryptedProfessionalDetails.preferred_language3,
      specialization: encryptedProfessionalDetails.specialization,
      qualifications: encryptedProfessionalDetails.qualifications,
      experience_years: encryptedProfessionalDetails.experience_years,
      availability: encryptedProfessionalDetails.availability,
      client_coursework: encryptedProfessionalDetails.client_coursework,
      location: {
        city: encryptedAddressDetails.city,
        state: encryptedAddressDetails.state,
        country: encryptedAddressDetails.country,
      },
      email_hash: hashedEmail,
      phone_hash: hashedPhone,
      student_therapist_id_hash: hashedStudentTherapistId,
      blob_stprage_path: pdfFileName,
    });

    await newStudentTherapist.save();

    const supervisor = await Supervisor.findOne({
      _id: personalDetails.supervisor_id,
    });

    if (!supervisor) {
      return res.status(404).json({ message: "sup-not-fnd" });
    }

    supervisor.allocated_therapists.push(newStudentTherapist._id); // Add therapist
    await supervisor.save(); // Save supervisor with updated therapists

    res.status(201).json({ message: "user-suc" });
  } catch (error) {
    console.log(error);
  }
};

export const getStudentsById = async (req, res) => {
  const { student_therapist_id } = req.params;

  try {
    const hashedStudentTherapistId = generateHashedData(student_therapist_id);

    const studentTherapist = await StudentTherapist.findOne({
      student_therapist_id_hash: hashedStudentTherapistId,
    });

    if (!studentTherapist) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "student-therapists",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptData = {
      _id: studentTherapist._id,
      student_therapist_id: Object.fromEntries(
        studentTherapist.student_therapist_id
      ),
      name: Object.fromEntries(studentTherapist.name),
      email: Object.fromEntries(studentTherapist.email),
      phone_no: Object.fromEntries(studentTherapist.phone_no),
      age: Object.fromEntries(studentTherapist.age),
      sex: Object.fromEntries(studentTherapist.sex),
      preferred_language1: Object.fromEntries(
        studentTherapist.preferred_language1
      ),
      preferred_language2: Object.fromEntries(
        studentTherapist.preferred_language2
      ),
      preferred_language3: Object.fromEntries(
        studentTherapist.preferred_language3
      ),
      specialization: Object.fromEntries(studentTherapist.specialization),
      qualifications: Object.fromEntries(studentTherapist.qualifications),
      experience_years: Object.fromEntries(studentTherapist.experience_years),
      availability: Object.fromEntries(studentTherapist.availability),
      client_coursework: Object.fromEntries(studentTherapist.client_coursework),
    };

    const decryptLocation = {
      city: Object.fromEntries(studentTherapist.location.city),
      state: Object.fromEntries(studentTherapist.location.state),
      country: Object.fromEntries(studentTherapist.location.country),
    };

    const decryptedLocation = decryptSection(decryptLocation, key);

    const decryptedStudentTherapist = decryptSection(decryptData, key);
    decryptedStudentTherapist["location"] = decryptedLocation;
    decryptedStudentTherapist["supervisor_id"] = studentTherapist.supervisor_id;

    res.status(200).json(decryptedStudentTherapist);
  } catch (error) {
    console.log(error);
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const studentTherapists = await StudentTherapist.find();

    if (!studentTherapists) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "student-therapists",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptedStudentTherapists = studentTherapists.map(
      (studentTherapist) => {
        const decryptData = {
          _id: studentTherapist._id,
          student_therapist_id: Object.fromEntries(
            studentTherapist.student_therapist_id
          ),
          name: Object.fromEntries(studentTherapist.name),
          email: Object.fromEntries(studentTherapist.email),
          phone_no: Object.fromEntries(studentTherapist.phone_no),
          age: Object.fromEntries(studentTherapist.age),
          sex: Object.fromEntries(studentTherapist.sex),
          preferred_language1: Object.fromEntries(
            studentTherapist.preferred_language1
          ),
          preferred_language2: Object.fromEntries(
            studentTherapist.preferred_language2
          ),
          preferred_language3: Object.fromEntries(
            studentTherapist.preferred_language3
          ),
          specialization: Object.fromEntries(studentTherapist.specialization),
          qualifications: Object.fromEntries(studentTherapist.qualifications),
          experience_years: Object.fromEntries(
            studentTherapist.experience_years
          ),
          availability: Object.fromEntries(studentTherapist.availability),
          client_coursework: Object.fromEntries(
            studentTherapist.client_coursework
          ),
        };

        const decryptedData = decryptSection(decryptData, key);
        const decryptLocation = {
          city: Object.fromEntries(studentTherapist.location.city),
          state: Object.fromEntries(studentTherapist.location.state),
          country: Object.fromEntries(studentTherapist.location.country),
        };

        const decryptedLocation = decryptSection(decryptLocation, key);

        decryptedData["location"] = decryptedLocation;
        decryptedData["supervisor_id"] = studentTherapist.supervisor_id;

        return decryptedData;
      }
    );

    res.status(200).json(decryptedStudentTherapists);
  } catch (error) {
    console.log(error);
  }
};

export const getStudentsByObjectId = async (req, res) => {
  const { student_therapist_id } = req.params;

  try {
    const studentTherapist = await StudentTherapist.findById(
      student_therapist_id
    );

    if (!studentTherapist) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "student-therapists",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptData = {
      _id: studentTherapist._id,
      student_therapist_id: Object.fromEntries(
        studentTherapist.student_therapist_id
      ),
      name: Object.fromEntries(studentTherapist.name),
      email: Object.fromEntries(studentTherapist.email),
      phone_no: Object.fromEntries(studentTherapist.phone_no),
      age: Object.fromEntries(studentTherapist.age),
      sex: Object.fromEntries(studentTherapist.sex),
      preferred_language1: Object.fromEntries(
        studentTherapist.preferred_language1
      ),
      preferred_language2: Object.fromEntries(
        studentTherapist.preferred_language2
      ),
      preferred_language3: Object.fromEntries(
        studentTherapist.preferred_language3
      ),
      specialization: Object.fromEntries(studentTherapist.specialization),
      qualifications: Object.fromEntries(studentTherapist.qualifications),
      experience_years: Object.fromEntries(studentTherapist.experience_years),
      availability: Object.fromEntries(studentTherapist.availability),
      client_coursework: Object.fromEntries(studentTherapist.client_coursework),
    };

    const decryptLocation = {
      city: Object.fromEntries(studentTherapist.location.city),
      state: Object.fromEntries(studentTherapist.location.state),
      country: Object.fromEntries(studentTherapist.location.country),
    };

    const decryptedLocation = decryptSection(decryptLocation, key);

    const decryptedStudentTherapist = decryptSection(decryptData, key);
    decryptedStudentTherapist["location"] = decryptedLocation;
    decryptedStudentTherapist["supervisor_id"] = studentTherapist.supervisor_id;

    res.status(200).json(decryptedStudentTherapist);
  } catch (error) {
    console.log(error);
  }
};

export const updateStudent = async (req, res) => {
  const { student_therapist_id, personalDetails, professionalDetails } =
    req.body;

  try {
    // Hash student_therapist_id to find the record
    const hashedStudentTherapistId = generateHashedData(student_therapist_id);

    // Find existing student therapist
    const existingStudent = await StudentTherapist.findOne({
      student_therapist_id_hash: hashedStudentTherapistId,
    });

    if (!existingStudent) {
      return res.status(404).json({ message: "user-not-found" });
    }

    // Get encryption key
    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "student-therapists",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const iv = generateKeyAndIV();

    // Encrypt updated details
    const encryptedPersonalDetails = encryptSection(personalDetails, key, iv);

    const { location, ...updatedProfessionalDetails } = professionalDetails;
    const encryptedProfessionalDetails = encryptSection(
      updatedProfessionalDetails,
      key,
      iv
    );

    const encryptedAddressDetails = encryptSection(location, key, iv);

    // Update the record
    existingStudent.student_image = encryptedPersonalDetails.student_image;
    existingStudent.name = encryptedPersonalDetails.name;
    existingStudent.password = encryptedPersonalDetails.password;
    existingStudent.email = encryptedPersonalDetails.email;
    existingStudent.phone_no = encryptedPersonalDetails.phone_no;
    existingStudent.age = encryptedPersonalDetails.age;
    existingStudent.sex = encryptedPersonalDetails.sex;
    existingStudent.preferred_language1 =
      encryptedProfessionalDetails.preferred_language1;
    existingStudent.preferred_language2 =
      encryptedProfessionalDetails.preferred_language2;
    existingStudent.preferred_language3 =
      encryptedProfessionalDetails.preferred_language3;
    existingStudent.specialization =
      encryptedProfessionalDetails.specialization;
    existingStudent.qualifications =
      encryptedProfessionalDetails.qualifications;
    existingStudent.experience_years =
      encryptedProfessionalDetails.experience_years;
    existingStudent.availability = encryptedProfessionalDetails.availability;
    existingStudent.client_coursework =
      encryptedProfessionalDetails.client_coursework;
    existingStudent.location = {
      city: encryptedAddressDetails.city,
      state: encryptedAddressDetails.state,
      country: encryptedAddressDetails.country,
    };
    existingStudent.email_hash = generateHashedData(
      Object.fromEntries(encryptedPersonalDetails.email)
    );
    existingStudent.phone_hash = generateHashedData(
      Object.fromEntries(encryptedPersonalDetails.phone_no)
    );
    existingStudent.student_therapist_id_hash = generateHashedData(
      Object.fromEntries(encryptedPersonalDetails.student_therapist_id)
    );
    existingStudent.supervisor_id = encryptedPersonalDetails.supervisor_id;

    // Save updated record
    await existingStudent.save();

    res.status(200).json({ message: "user-updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "update-failed" });
  }
};
