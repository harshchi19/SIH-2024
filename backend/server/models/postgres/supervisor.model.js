export const supervisorQuery = `
    CREATE TABLE IF NOT EXISTS supervisors (
        supervisor_id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        phone_no CHAR(10) CHECK (phone_no ~ '^[0-9]{10}$') NOT NULL,
        email VARCHAR(50) NOT NULL,
        age INT CHECK (age >= 0) NOT NULL,
        sex CHAR(1) CHECK (sex IN ('M', 'F', 'O')) NOT NULL,
        spoken_languages TEXT[] NOT NULL, 
        specialization TEXT[] NOT NULL, 
        experience_years INT CHECK (experience_years >= 0), 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

export const supervisorPatientAssignmentQuery = `
    CREATE TABLE IF NOT EXISTS supervisor_patient_assignment (
        id SERIAL PRIMARY KEY,
        supervisor_id VARCHAR(20) REFERENCES supervisors(supervisor_id) ON DELETE CASCADE,
        patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

export const supervisorTherapistAssignmentQuery = `
    CREATE TABLE IF NOT EXISTS supervisor_therapist_assignment (
        id SERIAL PRIMARY KEY,
        supervisor_id VARCHAR(20) REFERENCES supervisors(supervisor_id) ON DELETE CASCADE,
        student_therapist_id VARCHAR(20) REFERENCES student_therapists(student_therapist_id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

