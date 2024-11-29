// Encrypted

import mongoose from "mongoose";
const Schema = mongoose.Schema();

const TherapyPlanSchema = new Schema({
    supervisor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "supervisor"
    },
    student_therapist_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "student_therapist"
    },
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "patient"
    },
    short_term_goals: {
        type: String,
        required: true,
    },
    long_term_goals: {
        type: String,
        required: true,
    },
    number_of_steps: {
        type: String,
        required: true,
    },
    session_details: {
        type: [IndividualSessionSchema],
        required: true,
    },
});

const IndividualSessionSchema = new Schema({
    intent: {
        type: String,
        required: true,
    },
    progress: {
        type: Number,
        required: true,
    },
    machines_to_use: {
        type: [String],
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    goals: {
        type: [String],
        required: true,
    }
});

// Intent
// Progress
// Machines to be used
// Duration for each
// Goals for each session

export const TherapyPlan = mongoose.model("therapy_plan", TherapyPlanSchema);