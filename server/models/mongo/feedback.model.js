import mongoose, { Schema } from "mongoose";
import { StudentTherapist } from "./student_therapist.model";

const FeedbackSchema = new Schema({
  student_therapist_id: {
    type: Schema.Types.ObjectId,
    ref: "StudentTherapist",
    required: true,
  },
  supervisor_id: {
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  feedback: {
    type: Map,
    ref: "String",
    required: true,
  },
  feedback_status: {
    type: String,
  },
  feedback_deadline: {
    type: Date,
  },
  feedback_priority: {
    type: String,
  },
  rating: {
    type: Number,
  },
  report_status: {
    type: String,
    required: true,
  },
});
