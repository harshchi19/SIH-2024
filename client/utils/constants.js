export const HOST = process.env.NEXT_PUBLIC_SERVER_URL;

// Auth
export const AUTH_ROUTE = `${HOST}/auth`;
export const LOGIN_USER_ROUTE = `${AUTH_ROUTE}/login-user`;

// Sidebar
export const SIDEBAR_DATA_ROUTE = `${HOST}/sidebar/get-sidebar-data`;

// Patients
export const PATIENT_ROUTE = `${HOST}/patient`;
export const ADD_PATIENT_ROUTE = `${PATIENT_ROUTE}/add-patient`;