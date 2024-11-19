export const createPatientsTableQuery = `
    CREATE TABLE IF NOT EXISTS patients (
        patient_id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        age INT CHECK (age >= 0),
        sex CHAR(1) CHECK (sex IN ('M', 'F', 'O')),
        case_no VARCHAR(10) UNIQUE NOT NULL,
        clinician VARCHAR(50),
        multilingual_factors TEXT,
        language_evaluation TEXT,
        auditory_skills TEXT,
        formal_testing TEXT,
        diagnostic_formulation TEXT,
        clinical_impression TEXT,
        recommendations TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    );
`;


export const speechDevelopmentHistoryQuery = `
    CREATE TABLE IF NOT EXISTS speech_development_histories (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
        vocalization VARCHAR(100),
        babbling VARCHAR(100),
        first_word VARCHAR(100),
        first_sentence VARCHAR(100)
    );
`;


export const nonVerbalCommunicationQuery = `
    CREATE TABLE IF NOT EXISTS non_verbal_communications (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
        expression_level VARCHAR(100),
        comprehension_level VARCHAR(100)
    );
`;

export const articulationPhoneticLevelQuery = `
    CREATE TABLE IF NOT EXISTS articulation_phonetic_levels (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
        vowels_stage VARCHAR(100),
        consonants_stage VARCHAR(100),
        blends_stage VARCHAR(100)
    );
`;

export const voiceQuery = `
    CREATE TABLE IF NOT EXISTS patient_voices (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
        pitch_quality VARCHAR(100),
        loudness VARCHAR(100),
        voice_quality VARCHAR(100),
        breath_control VARCHAR(100)
    );
`;

export const suprasegmentalAspectsQuery = `
    CREATE TABLE IF NOT EXISTS suprasegmental_aspects (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
        emphasis_level VARCHAR(100),
        intonation VARCHAR(100),
        phrasing VARCHAR(100),
        speech_rate VARCHAR(100)
    );
`;

export const speechImitationSkillsQuery = `
    CREATE TABLE IF NOT EXISTS speech_imitation_skills (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
        speech_intelligibility_score INT CHECK (speech_intelligibility_score BETWEEN 0 AND 100),
        stimuli_used VARCHAR(50)
    );
`;

export const readingWritingSkillsQuery = `
    CREATE TABLE IF NOT EXISTS reading_writing_skills (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
        letter_recognition TEXT,
        word_recognition TEXT,
        reading_comprehension TEXT
    );
`;

// Pre-Case Evaluation
export const preTherapyEvaluationQuery = `
    CREATE TABLE IF NOT EXISTS pre_therapy_evaluation (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
        evaluation_date DATE DEFAULT CURRENT_DATE,  
        evaluator_name VARCHAR(100),              
        provisional_diagnostics TEXT,             
        findings TEXT,                            
        communication_assessment TEXT,            
        cognitive_assessment TEXT,                
        behavioral_observations TEXT,             
        parental_feedback TEXT,                   
        recommended_tests TEXT,                   
        severity_level VARCHAR(50),               
        therapy_goals TEXT,                       
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;
