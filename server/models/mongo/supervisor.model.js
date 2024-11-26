import mongoose from "mongoose";
const Schema = mongoose.Schema;

const supervisorSchema = new Schema({
    supervisor_id: {
        type: Map,
        of: String,
        required: true
    },
    name: {
        type: Map,
        of: String,
        required: true
    },
    password: {
        type: Map,
        of: String,
        required: true
    },
    phone_no: {
        type: Map,
        of: String,
        required: true,
    },
    email: {
        type: Map,
        of: String,
        required: true
    },
    date_of_birth: {
        type: Map,
        of: String,
        required: true
    },
    age: {
        type: Map,
        of: String,
        required: true
    },
    sex: {
        type: Map,
        of: String,
        required: true,
        enum: ['M', 'F', 'O']
    },
    preferred_language1: {
        type: Map,
        of: String,
        required: true
    },
    preferred_language2: {
        type: Map,
        of: String,
        required: true
    },
    preferred_language3: {
        type: Map,
        of: String,
        required: true
    },
    user_image: {
        type: Map,
        of: String,
    },
    supervisor_id_hash: {
        type: String,
        required: true
    },
    email_hash: {
        type: String,
        required: true
    },
    phone_hash: {
        type: String,
        required: true
    },
    authenticated: {
        type: String,
        required: true,
        default: false
    },
    allocated_therapists: [
        {
            type: Map,
            of: String,
            ref: "student_therapist",
            default: null,
        }
    ],
    allocated_patients_active: [
        {
            type: Map,
            of: String,
            ref: "patient",
            default: null,
        }
    ],
    allocated_patients_inactive: [
        {
            type: Map,
            of: String,
            ref: "patient",
            default: null,
        }
    ],
    reports_assessed: [
        {
            type: Map,
            of: String,
            ref: "report",
            default: null,
        }
    ]
});

export const Supervisor = mongoose.model("supervisor", supervisorSchema);