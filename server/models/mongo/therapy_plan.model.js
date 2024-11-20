import mongoose from "mongoose";
const Schema = mongoose.Schema();

const therapyPlan = new Schema({
    supervisor: {
        type: String,
        required: true
    },
    student_therapist: [
        {
            type: String,
            required: true
        }
    ],
    patient: {
        type: String,
        required: true
    }
})