import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    case_no: {
      type: Map,
      of: String,
    },
    session_no: {
      type: String,
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    student_therapist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentTherapist",
    },
    name: {
      type: Map,
      of: String,
    },
    status: {
      type: Map,
      of: String,
    },
    history: {
      type: Map,
      of: String,
    },
    diagnosis: {
      type: Map,
      of: String,
    },
    treatment_plan: {
      type: Map,
      of: String,
    },
    progress: {
      type: Map,
      of: String,
    },
    graph1: {
      data: {
        type: [String],
      },
      value: {
        type: [String],
      },
    },
    graph2: {
      data: {
        type: [String],
      },
      value: {
        type: [Number],
      },
    },
    graph3: {
      data: {
        type: [String],
      },
      value: {
        type: [String],
      },
    },
    medicine: {
      type: Map,
      of: String,
    },
    equipments: {
      type: Map,
      of: String,
    },
    findings: {
      type: Map,
      of: String,
    },
    blob_storage_path: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", reportSchema);
