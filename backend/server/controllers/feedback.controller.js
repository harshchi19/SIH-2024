import { Feedback } from "../models/mongo/feedback.model.js";

export const addFeedback = async (req, res) => {
  const {
    student_therapist_id,
    supervisor_id,
    feedback,
    feedback_status,
    feedback_deadline,
    feedback_priority,
    rating,
    report_status,
  } = req.body;

  try {
    const newFeedback = new Feedback({
      student_therapist_id,
      supervisor_id,
      feedback,
      feedback_status,
      feedback_deadline,
      feedback_priority,
      rating,
      report_status,
    });

    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
