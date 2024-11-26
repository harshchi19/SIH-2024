// Not Encrypted

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
    calendar_id: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: ["patient", "student_therapist", "supervisor"],
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
    }
});

export const Calendar = mongoose.model("calendar", CalendarSchema);