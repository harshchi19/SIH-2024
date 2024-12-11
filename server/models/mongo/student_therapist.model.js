import mongoose, { Schema } from "mongoose";

const studentTherapistSchema = new Schema({
  // Basic Details
  student_therapist_id: {
    type: Map,
    of: String,
    required: true,
    unique: true,
  },
  name: {
    type: Map,
    of: String,
    required: true,
  },
  password: {
    type: Map,
    of: String,
    required: true,
  },
  phone_no: {
    type: Map,
    of: String,
    required: true,
  },
  email: {
    type: Map,
    of: String,
    required: true,
  },
  age: {
    type: Map,
    of: String,
    required: true,
  },
  sex: {
    type: Map,
    of: String,
    required: true,
  },
  preferred_language1: {
    type: Map,
    of: String,
    required: true,
  },
  preferred_language2: {
    type: Map,
    of: String,
    required: true,
  },
  preferred_language3: {
    type: Map,
    of: String,
    required: true,
  },
  specialization: {
    type: Map,
    of: String,
    required: true,
  },
  qualifications: {
    type: Map,
    of: String,
  },
  experience_years: {
    type: Map,
    of: String,
    required: true,
  },
  availability: {
    type: Map,
    of: String,
  },
  client_coursework: {
    type: Map,
    of: String,
  },
  location: {
    city: {
      type: Map,
      of: String,
      required: true,
    },
    state: {
      type: Map,
      of: String,
      required: true,
    },
    country: {
      type: Map,
      of: String,
      required: true,
    },
  },
  supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    of: String,
    ref: "Supervisor",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    of: String,
    ref: "Patient",
  },
  // Hashed Details
  student_therapist_id_hash: {
    type: String,
    required: true,
  },
  email_hash: {
    type: String,
    required: true,
  },
  phone_hash: {
    type: String,
    required: true,
  },
  student_image: {
    type: Map,
    of: String,
  },

  // Timestamps
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
export const StudentTherapist = mongoose.model(
  "Student_Therapist",
  studentTherapistSchema
);
