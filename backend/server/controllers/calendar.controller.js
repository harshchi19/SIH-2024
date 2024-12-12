import { generateHashedData } from "../helper/security.helper.js";
import { Calendar } from "../models/mongo/calendar.model.js";
import { Patient } from "../models/mongo/patient.model.js";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
import { Supervisor } from "../models/mongo/supervisor.model.js";
import { HeadOfDepartment } from "../models/mongo/hod.model.js";
import { Admin } from "../models/mongo/admin.model.js";

export const addCalendarEvent = async (req, res, next) => {
  const {
    title,
    supervisor,
    patient,
    roomNo,
    selected_date,
    startTime,
    endTime,
    color,
    activeTab,
    userId,
    userType,
  } = req.body;

  try {
    if (!title || !selected_date || !startTime || !userId || !userType) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const selectedDate = new Date(selected_date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    if (isNaN(startHour) || isNaN(startMinute)) {
      return res.status(400).json({ message: "Invalid start time format." });
    }

    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(startHour, startMinute);

    let endDateTime;
    if (endTime) {
      const [endHour, endMinute] = endTime.split(":").map(Number);
      if (isNaN(endHour) || isNaN(endMinute)) {
        return res.status(400).json({ message: "Invalid end time format." });
      }
      endDateTime = new Date(selectedDate);
      endDateTime.setHours(endHour, endMinute);
    } else {
      endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    }

    if (endDateTime <= startDateTime) {
      return res
        .status(400)
        .json({ message: "End time must be after start time." });
    }

    const hashedUserId = generateHashedData(userId);
    let currentUser;

    if (userType === "PAT") {
      currentUser = await Patient.findOne({
        patient_id_hash: hashedUserId,
      }).select("_id");
    } else if (userType === "STT") {
      currentUser = await StudentTherapist.findOne({
        student_therapist_id_hash: hashedUserId,
      }).select("_id");
    } else if (userType === "SUP") {
      currentUser = await Supervisor.findOne({
        supervisor_id_hash: hashedUserId,
      }).select("_id");
    } else if (userType === "HOD") {
      currentUser = await HeadOfDepartment.findOne({
        hash_hod_id: hashedUserId,
      }).select("_id");
    } else if (userType === "ADM") {
      currentUser = await Admin.findOne({
        admin_id_hash: hashedUserId,
      }).select("_id");
    }

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const eventData = {
      title,
      room_no: roomNo,
      selected_date: selectedDate,
      start_time: startDateTime,
      end_time: endDateTime,
      description: title,
      color: color,
      messageType: activeTab === "appointments" ? "appointments" : "reminder",
      userId: currentUser._id,
      userType,
    };

    if (supervisor) {
      eventData.supervisor_id = supervisor;
    }
    if (patient) {
      eventData.patient_id = patient;
    }

    const newEvent = new Calendar(eventData);

    await newEvent.save();

    return res
      .status(201)
      .json({ message: "Event added successfully!", event: newEvent });
  } catch (error) {
    console.error(`Error in addCalendarEvent: ${error}`);
    return res.status(500).json({ message: "int-ser-err" });
  }
};

export const getAllCalendarEvents = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const userType = userId.split("-")[0];

    if (!["PAT", "STT", "SUP", "HOD", "ADM"].includes(userType)) {
      return res.status(400).json({ message: "invalid-user" });
    }

    const hashedUserId = generateHashedData(userId);

    let currentUser = null;
    if (userType === "PAT") {
      currentUser = await Patient.findOne({
        patient_id_hash: hashedUserId,
      }).select("_id");
    } else if (userType === "STT") {
      currentUser = await StudentTherapist.findOne({
        student_therapist_id_hash: hashedUserId,
      }).select("_id");
    } else if (userType === "SUP") {
      currentUser = await Supervisor.findOne({
        supervisor_id_hash: hashedUserId,
      }).select("_id");
    } else if (userType === "HOD") {
      currentUser = await HeadOfDepartment.findOne({
        hash_hod_id: hashedUserId,
      }).select("_id");
    } else if (userType === "ADM") {
      currentUser = await Admin.findOne({
        admin_id_hash: hashedUserId,
      }).select("_id");
    }

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const appointments = await Calendar.find({
      messageType: "appointments",
    }).lean();

    const reminders = await Calendar.find({
      userId: currentUser._id,
      messageType: "reminder",
    }).lean();

    const events = [
      ...appointments.map((event) => ({ ...event, eventType: "appointment" })),
      ...reminders.map((event) => ({ ...event, eventType: "reminder" })),
    ];

    return res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserObjId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const userType = userId.split("-")[0];

    if (
      userType !== "PAT" &&
      userType !== "STT" &&
      userType !== "SUP" &&
      userType !== "HOD" &&
      userType !== "ADM"
    ) {
      return res.status(400).json({ message: "invalid-user" });
    }

    const hashedUserId = generateHashedData(userId);
    let currentUser;

    if (userType === "PAT") {
      currentUser = await Patient.findOne({
        patient_id_hash: hashedUserId,
      }).select("_id");
    } else if (userType === "STT") {
      currentUser = await StudentTherapist.findOne({
        student_therapist_id_hash: hashedUserId,
      }).select("_id");
    } else if (userType === "SUP") {
      currentUser = await Supervisor.findOne({
        supervisor_id_hash: hashedUserId,
      }).select("_id");
    } else if (userType === "HOD") {
      currentUser = await HeadOfDepartment.findOne({
        hash_hod_id: hashedUserId,
      }).select("_id");
    } else if (userType === "ADM") {
      currentUser = await Admin.findOne({
        admin_id_hash: hashedUserId,
      }).select("_id");
    }

    return res.status(200).json({ userId: currentUser._id });
  } catch (error) {
    console.error(`Error in getUserObjId: ${error}`);
    return res.status(500).json({ message: "int-ser-err" });
  }
};

export const updateEventById = async (req, res, next) => {
  const {
    _id,
    title,
    supervisor,
    patient,
    roomNo,
    selected_date,
    startTime,
    endTime,
    color,
    description,
    activeTab,
  } = req.body;

  try {
    if (!_id) {
      return res.status(400).json({ error: "event-id-reqd" });
    }

    if (activeTab === "reminder") {
    }

    if (startTime <= endTime) {
      return res
        .status(400)
        .json({ message: "End time must be after start time." });
    }

    const updatedEvent = await Calendar.findByIdAndUpdate(
      _id,
      {
        title,
        supervisor_id: supervisor || null,
        patient_id: patient || null,
        room_no: roomNo,
        selected_date: selected_date,
        start_time: startTime,
        end_time: endTime,
        description,
        color,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.status(200).json({
      message: "Event updated successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    console.error(`Error in updateEventById: ${error}`);
    return res.status(500).json({ message: "int-ser-err" });
  }
};
