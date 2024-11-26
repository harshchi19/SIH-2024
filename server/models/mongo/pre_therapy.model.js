// Encrypted

import mongoose from "mongoose";
const Schema = mongoose.Schema();

const PreTherapyDetails = new Schema({
    patient_id: {
        type: Map,
        of: String,
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
    age_sex: {
        type: Map,
        of: String,
        required: true
    },
    date_of_assignment: {
        type: Map,
        of: String,
        required: true
    },
    student_therapist_id: {
        type: Map,
        of: String,
        required: true,
        ref: "student_therapist"
    },
    supervisor_id: {
        type: Map,
        of: String,
        required: true,
        ref: "supervisor"
    },
    provisional_diagnosis: {
        type: Map,
        of: String,
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
    confidence_score: {
        type: Map,
        of: String,
        required: true
    }
});

export const PreTherapy = mongoose.model("pre_therapy", PreTherapyDetails);