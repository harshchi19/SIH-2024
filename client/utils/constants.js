export const HOST = process.env.NEXT_PUBLIC_SERVER_URL;

// Auth
export const AUTH_ROUTE = `${HOST}/auth`;
export const LOGIN_USER_ROUTE = `${AUTH_ROUTE}/login-user`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout-user`;
export const GET_USER_DETAILS_BY_ID_ROUTE = `${AUTH_ROUTE}/get-user-by-id`;

// Sidebar
export const SIDEBAR_DATA_ROUTE = `${HOST}/sidebar/get-sidebar-data`;
export const GET_UPCOMING_EVENT_ROUTE = `${HOST}/sidebar/get-upcoming-event`;

// Patients
export const PATIENT_ROUTE = `${HOST}/patient`;
export const ADD_PATIENT_ROUTE = `${PATIENT_ROUTE}/add-patient`;
export const GET_PAT_BY_ID_ROUTE = `${PATIENT_ROUTE}/get-patient-by-id`;
export const GET_ALL_PAT_ROUTE = `${PATIENT_ROUTE}/get-all-patients`;

// Pre Therapy for Patient
export const PRE_THERAPY_ROUTE = `${HOST}/pre_therapy`;
export const GET_PATIENT_FROM_ID = `${PRE_THERAPY_ROUTE}/get-pre-therapy-user`;

// Student Therapists
export const STUDENT_THERAPIST_ROUTE = `${HOST}/student-therapist`;
export const ADD_STUDENT_THERAPIST_ROUTE = `${STUDENT_THERAPIST_ROUTE}/add-student`;
export const GET_STT_BY_ID_ROUTE = `${STUDENT_THERAPIST_ROUTE}/get-student-by-id`;
export const GET_ALL_STT_ROUTE = `${STUDENT_THERAPIST_ROUTE}/get-all-students`;

// Supervisors
export const SUPERVISOR_ROUTE = `${HOST}/supervisor`;
export const ADD_SUPERVISOR_ROUTE = `${SUPERVISOR_ROUTE}/add-supervisor`;
export const GET_SUP_BY_ID_ROUTE = `${SUPERVISOR_ROUTE}/get-supervisor-by-id`;
export const GET_ALL_SUP_ROUTE = `${SUPERVISOR_ROUTE}/get-all-supervisors`;

//Contacts
export const CONTACTS_ROUTE = `${HOST}/contacts`;
export const GET_CONTACTS = `${CONTACTS_ROUTE}/get-contacts`;



// Calendar
export const CALENDAR_ROUTE = `${HOST}/calendar`;
export const ADD_CALENDAR_EVENT_ROUTE = `${CALENDAR_ROUTE}/add-calendar-event`;
export const GET_USER_CALENDAR_EVENTS_ROUTE = `${CALENDAR_ROUTE}/get-calendar-events`;
export const GET_USER_OBJ_ID = `${CALENDAR_ROUTE}/get-user-obj-id`;
export const UPDATE_EVENT_BY_ID = `${CALENDAR_ROUTE}/update-event`;