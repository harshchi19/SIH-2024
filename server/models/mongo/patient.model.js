import mongoose from "mongoose";
const { Schema } = mongoose;

const patientsSchema = new Schema({
    // Basic Details
    patient_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true,
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true,
    },
    sex: {
        type: String,
        required: true,
        enum: ['M', 'F', 'O']
    },
    preferred_language: {
        type: String,
        required: true
    },
    user_image: {
        type: String
    },
    case_no: {
        type: String,
        required: true,
        unique: true
    },

    // Address Details
    address: {
        address_line1: {
            type: String,
            required: true
        },
        address_line2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        postal_code: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },

    // Medical Information
    medical_details: {
        supervisor_id: [{
            type: String,
            ref: "Supervisor"
        }],
        student_therapist_id: [{
            type: String,
            ref: "StudentTherapist"
        }],
        multilingual_factors: {
            type: String
        },
        details_to_pay_attention: {
            type: String,
        },
        language_evaluation: {
            type: String
        },
        auditory_skills: {
            type: String
        },
        formal_testing: {
            type: String
        },
        diagnostic_formulation: {
            type: String
        },
        clinical_impression: {
            type: String
        },
        recommendations: {
            type: String
        },
    },

    // Speech Development History
    speech_development_history: {
        vocalization: {
            type: String
        },
        babbling: {
            type: String
        },
        first_word: {
            type: String
        },
        first_sentence: {
            type: String
        },
    },

    // Non-Verbal Communication
    non_verbal_communication: {
        expression_level: {
            type: String
        },
        comprehension_level: {
            type: String
        }
    },

    // Articulation and Phonetic Level
    articulation_at_phonetic_level: {
        vowels_stage: {
            type: String
        },
        consonants_stage: {
            type: String
        },
        blends_stage: {
            type: String
        },
    },

    // Voice Details
    voice_details: {
        pitch_quality: {
            type: String
        },
        loudness: {
            type: String
        },
        voice_quality: {
            type: String
        },
        breath_control: {
            type: String
        }
    },

    // Suprasegmental Aspects
    suprasegmental_aspects: {
        emphasis_level: {
            type: String
        },
        intonation: {
            type: String
        },
        phrasing: {
            type: String
        },
        speech_rate: {
            type: String
        }
    },

    reading_writing_skills: {
        letter_recognition: {
            type: String
        },
        word_recognition: {
            type: String
        },
        reading_comprehension: {
            type: String
        },
        copying: {
            type: String
        },
        writing_to_dictation: {
            type: String
        },
        spontaneous_writing: {
            type: String
        },
    },

    // Timestamps
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

export const Patient = mongoose.model('Patient', patientsSchema);