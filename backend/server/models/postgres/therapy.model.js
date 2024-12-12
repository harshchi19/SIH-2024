export const therapySessionsQuery = `
    CREATE TABLE IF NOT EXISTS therapy_sessions (
        therapy_id VARCHAR(100) PRIMARY KEY,
        student_therapist_id VARCHAR(20) REFERENCES student_therapist(student_therapist_id) ON DELETE CASCADE,
        patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;