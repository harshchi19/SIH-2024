import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SessionsSchema = new Schema(
  {
    student_therapist_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "student_therapist",
    },
    report_name: {
      // All
      type: Map,
      of: String,
      required: true,
    },
    report_type: {
      // All
      type: Map,
      of: String,
      required: true,
    },
    report_status: {
      type: Map,
      of: String,
      required: true,
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "patient",
    },
    session_number: {
      // All
      type: Map,
      of: String,
      required: true,
    },
    date_of_session: {
      // All
      type: Map,
      of: String,
      required: true,
    },
    start_time: {
      // All
      type: Map,
      of: String,
      required: true,
    },
    end_time: {
      // All
      type: Map,
      of: String,
      required: false,
    },
    progress: {
      // All
      type: Map,
      of: String,
      required: false,
    },
    goals: {
      type: Map,
      of: String,
      required: false,
    },
    machines_used: [
      {
        type: String,
      },
    ],
    notes: {
      type: Map,
      of: String,
    },
    results: {
      type: Map,
      of: String,
      required: false,
    },
    external_test: {
      type: Map,
      of: String,
    },
    next_session_date: {
      // All
      type: Map,
      of: String,
    },
    next_session_timings: {
      // All
      type: Map,
      of: String,
    },
    next_session_therapist: {
      // All
      type: mongoose.Schema.Types.ObjectId,
      ref: "student_therapist",
    },
    to_do_before_next_session: [
      // All
      {
        type: String,
      },
    ],
    progress_next_session: {
      type: Map,
      of: String,
    },
    goals_next_session: {
      type: Map,
      of: String,
    },
    session_number_hash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Sessions = mongoose.model("session", SessionsSchema);
