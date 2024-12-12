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
        enum: ["PAT", "STT", "SUP"],
    },
    messageType: {
        type: String,
        required: true,
        enum: ["reminder", "appointments"]
    },
    title: {
        type: String,
        required: true
    },
    supervisor_id: {
        type: Schema.Types.ObjectId,
        ref: "supervisor"
    },
    patient_id: {
        type: Schema.Types.ObjectId,
        ref: "patient"
    },
    room_no: {
        type: String,
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
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true,
        default: "#E48E58"
    },
    reminder: {
        type: String,
        required: true,
        default: true
    },
});

export const Calendar = mongoose.model("calendar", CalendarSchema);