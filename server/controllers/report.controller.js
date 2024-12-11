import {
  decryptSection,
  encryptSection,
  generateKeyAndIV,
} from "../helper/security.helper.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { Patient } from "../models/mongo/patient.model.js";
import Report from "../models/mongo/report.model.js";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
import { unwrapKey } from "./keys.controller.js";
import { AzurePDFDownloader } from "../helper/azure.helper.js";
import { AzurePDFUploader } from "../helper/azure.helper.js";

import { generatePdf } from "../helper/pdf.helper.js"; // Assume this helper generates a PDF from data

export const generateReport = async (req, res) => {
  const {
    case_no,
    session_no,
    patient_id,
    student_therapist_id,
    name,
    status,
    history,
    diagnosis,
    treatment_plan,
    progress,
    graph1,
    graph2,
    graph3,
    medicine,
    equipments,
    findings,
  } = req.body;

  try {
    const patient = await Patient.findOne({ _id: patient_id });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const studentTherapist = await StudentTherapist.findOne({
      _id: student_therapist_id,
    });
    if (!studentTherapist) {
      return res.status(404).json({ message: "Student therapist not found" });
    }

    const findDuplicateEntries = await Report.findOne({ session_no });
    if (findDuplicateEntries) {
      return res.status(400).json({ message: "Report already exists" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "reports",
    });

    if (!findEncryptionKey) {
      return res.status(404).json({ message: "Encryption key not found" });
    }

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const iv = generateKeyAndIV();

    const report = {
      report_details: {
        case_no,
        session_no,
        patient_id,
        student_therapist_id,
        name,
        status,
        history,
        diagnosis,
        treatment_plan,
        progress,
        graph1_data: graph1.data ? graph1.data : [],
        graph1_value: graph1.value ? graph1.value : [],
        graph2_data: graph2.data ? graph2.data : [],
        graph2_value: graph2.value ? graph2.value : [],
        graph3_data: graph3?.data,
        graph3_value: graph3?.value,
        medicine,
        equipments,
        findings,
      },
    };

    // Generate the PDF
    const pdfFileName = `${session_no}_${case_no}_report_details.pdf`;
    await generatePdf(report, pdfFileName);

    // Upload PDF to Azure Blob Storage
    const containerName = process.env.AZURE_REPORTS_CONTAINER;
    const uploadResponse = await AzurePDFUploader(containerName, pdfFileName);

    if (!uploadResponse) {
      return res.status(500).json({ message: "Error uploading PDF to Azure" });
    }

    const encryptedSection = encryptSection(
      {
        case_no,
        patient_id,
        student_therapist_id,
        name,
        status,
        history,
        diagnosis,
        treatment_plan,
        progress,
        medicine,
        equipments,
        findings,
      },
      key,
      iv
    );

    const encryptedReport = new Report({
      case_no: encryptedSection.case_no,
      session_no: session_no,
      patient_id: patient_id,
      student_therapist_id: student_therapist_id,
      name: encryptedSection.name,
      status: encryptedSection.status,
      history: encryptedSection.history,
      diagnosis: encryptedSection.diagnosis,
      treatment_plan: encryptedSection.treatment_plan,
      progress: encryptedSection.progress,
      graph1,
      graph2,
      graph3,
      medicine: encryptedSection.medicine,
      equipments: encryptedSection.equipments,
      findings: encryptedSection.findings,
      blob_storage_path: pdfFileName, // Store the Azure Blob file path
    });

    await encryptedReport.save();

    res.status(200).json(encryptedReport);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "report-cntrlr-err", error: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();

    if (!reports) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "reports",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptedReports = reports.map((report) => {
      const decryptData = {
        case_no: Object.fromEntries(report.case_no),
        name: Object.fromEntries(report.name),
        status: Object.fromEntries(report.status),
        history: Object.fromEntries(report.history),
        diagnosis: Object.fromEntries(report.diagnosis),
        treatment_plan: Object.fromEntries(report.treatment_plan),
        progress: Object.fromEntries(report.progress),
        medicine: Object.fromEntries(report.medicine),
        equipments: Object.fromEntries(report.equipments),
        findings: Object.fromEntries(report.findings),
      };

      const decryptedData = decryptSection(decryptData, key);

      decryptedData._id = report._id;
      decryptedData.patient_id = report.patient_id;
      decryptedData.student_therapist_id = report.student_therapist_id;
      decryptedData.graph1 = report.graph1;
      decryptedData.graph2 = report.graph2;
      decryptedData.graph3 = report.graph3;
      decryptedData.blob_storage_path = report.blob_storage_path;
      decryptedData.createdAt = report.createdAt;
      decryptedData.updatedAt = report.updatedAt;

      return decryptedData;
    });

    res.status(200).json(decryptedReports);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "report-cntrlr-err", error: error.message });
  }
};
