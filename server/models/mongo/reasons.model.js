import mongoose, { Schema } from "mongoose";

const ReasonsSchema = new Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  case_no: {
    type: String,
    required: true,
  },
  actionBy: {
    type: String,
    required: true,
  },
  actionByUserType: {
    type: String,
    required: true,
    default: "ADM",
    enum: ["ADM"],
  },
  actionType: {
    type: String,
    required: true,
    enum: ["TERMINATED", "TRANSFERED"],
  },
  reason: {
    type: String,
    required: true,
  },
});

export const Reasons = new mongoose.model("reason", ReasonsSchema);
