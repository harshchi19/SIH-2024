export const HOST = process.env.NEXT_SERVER_URL;

// Sidebar
export const SIDEBAR_DATA_ROUTE = `${HOST}/sidebar/get-sidebar-data`;

// Patients
export const PATIENT_ROUTE = `${HOST}/patient`;
export const ADD_PATIENT_ROUTE = `${PATIENT_ROUTE}/add-patient`;