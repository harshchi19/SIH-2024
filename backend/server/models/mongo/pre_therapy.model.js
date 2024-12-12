// Encrypted

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PreTherapyDetails = new Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "patient"
    },
    case_no: {
        type: Map,
        of: String,
        required: true,
        ref: "patient"
    },
    name: {
        type: Map,
        of: String,
        required: true,
    },
    age: {
        type: Map,
        of: String,
        required: true
    },
    sex: {
        type: Map,
        of: String,
        required: true
    },
    date_of_assignment: {
        type: Map,
        of: String,
        required: true
    },
    student_therapist: {
        type: Map,
        of: String,
        required: true
    },
    supervisor: {
        type: Map,
        of: String,
        required: true
    },
    provisional_diagnosis: {
        type: Map,
        of: String,
        required: true
    },
    case_no_hash: {
        type: String,
        required: true
    },
    findings: {
        opme: {
            type: Map,
            of: String,
            required: true
        },
        reception: {
            type: Map,
            of: String,
            required: true
        },
        expression: {
            type: Map,
            of: String,
            required: true
        },
        pragmatics: {
            type: Map,
            of: String,
            required: true
        },
        attention: {
            type: Map,
            of: String,
            required: true
        },
        auditory_skill: {
            type: Map,
            of: String,
            required: true
        },
        play_behavior: {
            type: Map,
            of: String,
            required: true
        },
        general_behavior: {
            type: Map,
            of: String,
            required: true
        },
        formal_testing: {
            type: Map,
            of: String,
            required: true
        },
        clinical_impression: {
            type: Map,
            of: String,
            required: true
        },
        additional_notes: {
            type: Map,
            of: String
        }
    },
    verified: {
        type: Boolean,
        default: false
    }
});

export const PreTherapy = mongoose.model("pre_therapy", PreTherapyDetails);