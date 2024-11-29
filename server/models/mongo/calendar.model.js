// Not Encrypted

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: ["patient", "student_therapist", "supervisor"],
    },
    messageType: {
        type: String,
        required: true,
        enum: ["reminder", "appointments"]
    },
    selected_date: {
        type: Date,
        required: true,
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    reminder: {
        type: String,
        required: true,
        default: true
    },
    color: {
        type: String,
        required: true,
        default: "#9D00FF"
    }
});

export const Calendar = mongoose.model("calendar", CalendarSchema);