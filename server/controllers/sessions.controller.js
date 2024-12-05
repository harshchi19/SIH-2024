import { de } from "date-fns/locale";
import {
  encryptSection,
  decryptSection,
  generateHashedData,
  generateKeyAndIV,
} from "../helper/security.helper.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { Patient } from "../models/mongo/patient.model.js";
import { Sessions } from "../models/mongo/sessions.model.js";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
import { unwrapKey } from "./keys.controller.js";

export const addSession = async (req, res) => {
  const {
    report_name,
    report_type,
    report_status,
    session_number,
    date_of_session,
  } = req.body;
  try {
    const studentTherapistId = req.body.student_therapist_id;
    const patientId = req.body.patient_id;

    const hashedStudentTherapistId = generateHashedData(studentTherapistId);
    const studentTherapist = await StudentTherapist.findOne({
      student_therapist_id_hash: hashedStudentTherapistId,
    })
      .select("_id")
      .lean();

    if (!studentTherapist) {
      return res.status(400).json({ message: "student-therapist-not-found" });
    }

    const hashedPatientId = generateHashedData(patientId);
    const patient = await Patient.findOne({
      patient_id_hash: hashedPatientId,
    })
      .select("_id")
      .lean();

    if (!patient) {
      return res.status(400).json({ message: "patient-not-found" });
    }

    const hashedSessionNumber = generateHashedData(session_number);

    let findDuplicateEntries = await Sessions.findOne({
      session_number_hash: hashedSessionNumber,
      student_therapist_id: studentTherapist._id,
      patient_id: patient._id,
    });

    if (findDuplicateEntries) {
      return res.status(400).json({ message: "session-alr-ext" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "sessions",
    });

    if (!findEncryptionKey) {
      console.log("Encryption key not found for 'sessions'");
      return res.status(500).json({ message: "encryption-key-not-found" });
    }

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const iv = generateKeyAndIV();
    const currentTime = new Date();
    const start_time = currentTime.toLocaleTimeString();

    const session = {
      report_name,
      report_type,
      report_status,
      session_number,
      date_of_session,
      start_time,
    };

    const encryptedSession = encryptSection(session, key, iv);

    const newSession = new Sessions({
      student_therapist_id: studentTherapist._id,
      patient_id: patient._id,
      report_name: encryptedSession.report_name,
      report_type: encryptedSession.report_type,
      report_status: encryptedSession.report_status,
      session_number: encryptedSession.session_number,
      date_of_session: encryptedSession.date_of_session,
      start_time: encryptedSession.start_time,
      session_number_hash: hashedSessionNumber,
    });

    await newSession.save();

    res.status(200).json(newSession);
  } catch (error) {
    console.error("Error in addSession:", error);
    res
      .status(500)
      .json({ message: "session-cntrlr-err", error: error.message });
  }
};

export const updateExistingSession = async (req, res) => {
  const {
    progress,
    goals,
    machines_used,
    notes,
    results,
    external_test,
    next_session_timings,
    next_session_therapist,
    to_do_before_next_session,
    progress_next_session,
    goals_next_session,
  } = req.body;

  try {
    const studentTherapistId = req.body.student_therapist_id;
    const patientId = req.body.patient_id;
    const hashedSessionNumber = req.body.session_number_hash;

    // Hash IDs and session number for secure matching
    const hashedStudentTherapistId = generateHashedData(studentTherapistId);
    const hashedPatientId = generateHashedData(patientId);

    // Find the student therapist
    const studentTherapist = await StudentTherapist.findOne({
      student_therapist_id_hash: hashedStudentTherapistId,
    })
      .select("_id")
      .lean();

    if (!studentTherapist) {
      return res.status(400).json({ message: "student-therapist-not-found" });
    }

    // Find the patient
    const patient = await Patient.findOne({
      patient_id_hash: hashedPatientId,
    })
      .select("_id")
      .lean();

    if (!patient) {
      return res.status(400).json({ message: "patient-not-found" });
    }

    // Find the existing session
    const existingSession = await Sessions.findOne({
      session_number_hash: hashedSessionNumber,
      student_therapist_id: studentTherapist._id,
      patient_id: patient._id,
    });

    if (!existingSession) {
      return res.status(404).json({ message: "session-not-found" });
    }

    // Find encryption key for sessions
    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "sessions",
    });

    if (!findEncryptionKey) {
      console.log("Encryption key not found for 'sessions'");
      return res.status(500).json({ message: "encryption-key-not-found" });
    }

    // Unwrap the encryption key
    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const iv = generateKeyAndIV(); // Generate a new IV for the updated data
    const end_time = new Date().toLocaleTimeString();

    console.log("next_session_therapist:", next_session_therapist);

    const nextSessionTherapist = await StudentTherapist.findOne({
      _id: next_session_therapist,
    });

    console.log("nextSessionTherapist:", nextSessionTherapist);

    if (!nextSessionTherapist) {
      return res
        .status(400)
        .json({ message: "next-session-therapist-not-found" });
    }

    // Prepare the session object for encryption
    const sessionUpdates = {
      end_time,
      progress,
      goals,
      notes,
      results,
      external_test,
      next_session_timings,
      progress_next_session,
      goals_next_session,
    };

    const encryptedSessionUpdates = encryptSection(sessionUpdates, key, iv);

    // Update the session
    existingSession.set({
      end_time: encryptedSessionUpdates.end_time,
      progress: encryptedSessionUpdates.progress,
      goals: encryptedSessionUpdates.goals,
      machines_used: machines_used,
      notes: encryptedSessionUpdates.notes,
      results: encryptedSessionUpdates.results,
      external_test: encryptedSessionUpdates.external_test,
      next_session_timings: encryptedSessionUpdates.next_session_timings,
      next_session_therapist: nextSessionTherapist._id,
      to_do_before_next_session: to_do_before_next_session,
      progress_next_session: encryptedSessionUpdates.progress_next_session,
      goals_next_session: encryptedSessionUpdates.goals_next_session,
      updatedAt: new Date(),
    });

    await existingSession.save();

    console.log("Session updated successfully");
    res
      .status(200)
      .json({ message: "session-updated", session: existingSession });
  } catch (error) {
    console.error("Error in updateExistingSession:", error);
    res
      .status(500)
      .json({ message: "session-cntrlr-err", error: error.message });
  }
};

export const getSessionsByPatientId = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const hashedPatientId = generateHashedData(patientId);

    const patient = await Patient.findOne({
      patient_id_hash: hashedPatientId,
    })
      .select("_id")
      .lean();

    if (!patient) {
      return res.status(400).json({ message: "patient-not-found" });
    }

    const sessions = await Sessions.find({ patient_id: patient._id }).lean();

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "sessions",
    });

    if (!findEncryptionKey) {
      console.log("Encryption key not found for 'sessions'");
      return res.status(500).json({ message: "encryption-key-not-found" });
    }

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptedSessions = sessions.map((session) => {
      // Helper to safely handle `Object.fromEntries`
      const safeFromEntries = (value) =>
        Array.isArray(value) ? Object.fromEntries(value) : value;

      const decryptData = {
        report_name: safeFromEntries(session.report_name),
        report_type: safeFromEntries(session.report_type),
        report_status: safeFromEntries(session.report_status),
        session_number: safeFromEntries(session.session_number),
        date_of_session: safeFromEntries(session.date_of_session),
        start_time: safeFromEntries(session.start_time),
        end_time: safeFromEntries(session.end_time),
        progress: safeFromEntries(session.progress),
        goals: safeFromEntries(session.goals),
        notes: safeFromEntries(session.notes),
        results: safeFromEntries(session.results),
        external_test: safeFromEntries(session.external_test),
        next_session_timings: safeFromEntries(session.next_session_timings),
        progress_next_session: safeFromEntries(session.progress_next_session),
        goals_next_session: safeFromEntries(session.goals_next_session),
      };

      const decryptedSession = decryptSection(decryptData, key);

      return {
        ...decryptedSession,
        _id: session._id,
        student_therapist_id: session.student_therapist_id,
        patient_id: session.patient_id,
        machines_used: session.machines_used,
        next_session_therapist: session.next_session_therapist,
        to_do_before_next_session: session.to_do_before_next_session,
        session_number_hash: session.session_number_hash,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };
    });

    res.status(200).json(decryptedSessions);
  } catch (error) {
    console.error("Error in getSessionsByPatientId:", error);
    res
      .status(500)
      .json({ message: "session-cntrlr-err", error: error.message });
  }
};

export const getSessionsByStudentTherapistId = async (req, res) => {
  try {
    const studentTherapistId = req.params.studentTherapistId;

    const hashedStudentTherapistId = generateHashedData(studentTherapistId);

    const studentTherapist = await StudentTherapist.findOne({
      student_therapist_id_hash: hashedStudentTherapistId,
    })
      .select("_id")
      .lean();

    if (!studentTherapist) {
      return res.status(400).json({ message: "student-therapist-not-found" });
    }

    const sessions = await Sessions.find({
      student_therapist_id: studentTherapist._id,
    }).lean();

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "sessions",
    });

    if (!findEncryptionKey) {
      console.log("Encryption key not found for 'sessions'");
      return res.status(500).json({ message: "encryption-key-not-found" });
    }

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptedSessions = sessions.map((session) => {
      const safeFromEntries = (value) =>
        Array.isArray(value) ? Object.fromEntries(value) : value;

      const decryptData = {
        report_name: safeFromEntries(session.report_name),
        report_type: safeFromEntries(session.report_type),
        report_status: safeFromEntries(session.report_status),
        session_number: safeFromEntries(session.session_number),
        date_of_session: safeFromEntries(session.date_of_session),
        start_time: safeFromEntries(session.start_time),
        end_time: safeFromEntries(session.end_time),
        progress: safeFromEntries(session.progress),
        goals: safeFromEntries(session.goals),
        notes: safeFromEntries(session.notes),
        results: safeFromEntries(session.results),
        external_test: safeFromEntries(session.external_test),
        next_session_timings: safeFromEntries(session.next_session_timings),
        progress_next_session: safeFromEntries(session.progress_next_session),
        goals_next_session: safeFromEntries(session.goals_next_session),
      };

      const decryptedSession = decryptSection(decryptData, key);

      return {
        ...decryptedSession,
        _id: session._id,
        student_therapist_id: session.student_therapist_id,
        patient_id: session.patient_id,
        machines_used: session.machines_used,
        next_session_therapist: session.next_session_therapist,
        to_do_before_next_session: session.to_do_before_next_session,
        session_number_hash: session.session_number_hash,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };
    });

    res.status(200).json(decryptedSessions);
  } catch (error) {
    console.error("Error in getSessionsByStudentTherapistId:", error);
    res
      .status(500)
      .json({ message: "session-cntrlr-err", error: error.message });
  }
};

export const getSessionsByTherapistIdPatientId = async (req, res) => {
  try {
    const studentTherapistId = req.params.studentTherapistId;
    const hashedStudentTherapistId = generateHashedData(studentTherapistId);

    const studentTherapist = await StudentTherapist.findOne({
      student_therapist_id_hash: hashedStudentTherapistId,
    })
      .select("_id")
      .lean();

    if (!studentTherapist) {
      return res.status(400).json({ message: "student-therapist-not-found" });
    }

    const patientId = req.params.patientId;
    const hashedPatientId = generateHashedData(patientId);

    const patient = await Patient.findOne({
      patient_id_hash: hashedPatientId,
    })
      .select("_id")
      .lean();

    if (!patient) {
      return res.status(400).json({ message: "patient-not-found" });
    }

    const sessions = await Sessions.find({
      student_therapist_id: studentTherapist._id,
      patient_id: patient._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "sessions",
    });

    if (!findEncryptionKey) {
      console.log("Encryption key not found for 'sessions'");
      return res.status(500).json({ message: "encryption-key-not-found" });
    }

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptedSessions = sessions.map((session) => {
      const safeFromEntries = (value) =>
        Array.isArray(value) ? Object.fromEntries(value) : value;

      const decryptData = {
        report_name: safeFromEntries(session.report_name),
        report_type: safeFromEntries(session.report_type),
        report_status: safeFromEntries(session.report_status),
        session_number: safeFromEntries(session.session_number),
        date_of_session: safeFromEntries(session.date_of_session),
        start_time: safeFromEntries(session.start_time),
        end_time: safeFromEntries(session.end_time),
        progress: safeFromEntries(session.progress),
        goals: safeFromEntries(session.goals),
        notes: safeFromEntries(session.notes),
        results: safeFromEntries(session.results),
        external_test: safeFromEntries(session.external_test),
        next_session_timings: safeFromEntries(session.next_session_timings),
        progress_next_session: safeFromEntries(session.progress_next_session),
        goals_next_session: safeFromEntries(session.goals_next_session),
      };

      const decryptedSession = decryptSection(decryptData, key);

      return {
        ...decryptedSession,
        _id: session._id,
        student_therapist_id: session.student_therapist_id,
        patient_id: session.patient_id,
        machines_used: session.machines_used,
        next_session_therapist: session.next_session_therapist,
        to_do_before_next_session: session.to_do_before_next_session,
        session_number_hash: session.session_number_hash,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };
    });

    // Sort the decrypted sessions by session_number
    decryptedSessions.sort((a, b) => b.session_number - a.session_number);

    res.status(200).json(decryptedSessions);
  } catch (error) {
    console.error("Error in getSessionsByStudentTherapistId:", error);
    res
      .status(500)
      .json({ message: "session-cntrlr-err", error: error.message });
  }
};
