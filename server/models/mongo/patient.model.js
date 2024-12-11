// Encrypted

import mongoose from "mongoose";
const { Schema } = mongoose;

const patientsSchema = new Schema({
  // Basic Details
  patient_id: {
    type: Map,
    of: String,
    required: true,
    unique: true,
  },
  name: {
    type: Map,
    of: String,
    required: true,
  },
  password: {
    type: Map,
    of: String,
    required: true,
  },
  phone_no: {
    type: Map,
    of: String,
    required: true,
  },
  email: {
    type: Map,
    of: String,
    required: true,
  },
  date_of_birth: {
    type: Map,
    of: String,
    required: true,
  },
  date_of_assignment: {
    type: Map,
    of: String,
    required: true,
  },
  age: {
    type: Map,
    of: String,
    required: true,
  },
  sex: {
    type: Map,
    of: String,
    required: true,
    enum: ["M", "F", "O"],
  },
  preferred_language1: {
    type: Map,
    of: String,
    required: true,
  },
  preferred_language2: {
    type: Map,
    of: String,
    required: true,
  },
  preferred_language3: {
    type: Map,
    of: String,
    required: true,
  },
  user_image: {
    type: Map,
    of: String,
  },
  case_no: {
    type: Map,
    of: String,
    required: true,
    unique: true,
  },
  patient_id_hash: {
    type: String,
    required: true,
  },
  email_hash: {
    type: String,
    required: true,
  },
  phone_hash: {
    type: String,
    required: true,
  },
  case_no_hash: {
    type: String,
    required: true,
  },
  patient_issue: {
    type: Map,
    of: String,
    required: true,
  },
  patient_status: {
    type: String,
    enum: ["Terminated", "Ongoing"],
    default: "Ongoing",
  },

  // Address Details
  address: {
    address_line1: {
      type: Map,
      of: String,
      required: true,
    },
    address_line2: {
      type: Map,
      of: String,
    },
    city: {
      type: Map,
      of: String,
      required: true,
    },
    state: {
      type: Map,
      of: String,
      required: true,
    },
    postal_code: {
      type: Map,
      of: String,
      required: true,
    },
    country: {
      type: Map,
      of: String,
      required: true,
    },
  },

  // Medical Information
  medical_details: {
    supervisor_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supervisor",
      },
    ],
    student_therapist_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student_Therapist",
      },
    ],
    multilingual_factors: {
      type: Map,
      of: String,
    },
    details_to_pay_attention: {
      type: Map,
      of: String,
    },
    language_evaluation: {
      type: Map,
      of: String,
    },
    auditory_skills: {
      type: Map,
      of: String,
    },
    formal_testing: {
      type: Map,
      of: String,
    },
    diagnostic_formulation: {
      type: Map,
      of: String,
    },
    clinical_impression: {
      type: Map,
      of: String,
    },
    recommendations: {
      type: Map,
      of: String,
    },
  },

  // Speech Development History
  speech_development_history: {
    vocalization: {
      type: Map,
      of: String,
    },
    babbling: {
      type: Map,
      of: String,
    },
    first_word: {
      type: Map,
      of: String,
    },
    first_sentence: {
      type: Map,
      of: String,
    },
  },

  // Non-Verbal Communication
  non_verbal_communication: {
    expression_level: {
      type: Map,
      of: String,
    },
    comprehension_level: {
      type: Map,
      of: String,
    },
  },

  // Articulation and Phonetic Level
  articulation_at_phonetic_level: {
    vowels_stage: {
      type: Map,
      of: String,
    },
    consonants_stage: {
      type: Map,
      of: String,
    },
    blends_stage: {
      type: Map,
      of: String,
    },
  },

  // Voice Details
  voice_details: {
    pitch_quality: {
      type: Map,
      of: String,
    },
    loudness: {
      type: Map,
      of: String,
    },
    voice_quality: {
      type: Map,
      of: String,
    },
    breath_control: {
      type: Map,
      of: String,
    },
  },

  // Suprasegmental Aspects
  suprasegmental_aspects: {
    emphasis_level: {
      type: Map,
      of: String,
    },
    intonation: {
      type: Map,
      of: String,
    },
    phrasing: {
      type: Map,
      of: String,
    },
    speech_rate: {
      type: Map,
      of: String,
    },
  },

  reading_writing_skills: {
    letter_recognition: {
      type: Map,
      of: String,
    },
    word_recognition: {
      type: Map,
      of: String,
    },
    reading_comprehension: {
      type: Map,
      of: String,
    },
    copying: {
      type: Map,
      of: String,
    },
    writing_to_dictation: {
      type: Map,
      of: String,
    },
    spontaneous_writing: {
      type: Map,
      of: String,
    },
  },

  // Timestamps
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const Patient = mongoose.model("Patient", patientsSchema);
