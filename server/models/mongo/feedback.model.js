import mongoose, { Schema } from "mongoose";

const FeedbackSchema = new Schema({
  student_therapist_id: {
    type: Schema.Types.ObjectId,
    ref: "Student_Therapist",
    required: true,
  },
  supervisor_id: {
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  feedback: {
    type: String,
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

export const Feedback = mongoose.model("feedback", FeedbackSchema);
