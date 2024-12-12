export const HOST = process.env.NEXT_PUBLIC_SERVER_URL;

// Auth
export const AUTH_ROUTE = `${HOST}/auth`;
export const LOGIN_USER_ROUTE = `${AUTH_ROUTE}/login-user`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout-user`;
export const GET_USER_DETAILS_BY_ID_ROUTE = `${AUTH_ROUTE}/get-user-by-id`;
export const ADD_AUTH_USER = `${AUTH_ROUTE}/add-auth-user`;

// Sidebar
export const SIDEBAR_DATA_ROUTE = `${HOST}/sidebar/get-sidebar-data`;
export const GET_UPCOMING_EVENT_ROUTE = `${HOST}/sidebar/get-upcoming-event`;

// Dashboard
export const VISUALIZATION_ROUTE = `${HOST}/visualization`;
export const GET_CALENDAR_VISUALS_ROUTE = `${VISUALIZATION_ROUTE}/get-calendar-data`;

// Patients
export const PATIENT_ROUTE = `${HOST}/patient`;
export const ADD_PATIENT_ROUTE = `${PATIENT_ROUTE}/add-patient`;
export const GET_PAT_BY_ID_ROUTE = `${PATIENT_ROUTE}/get-patient-by-id`;
export const GET_PAT_BY_OBJECT_ID_ROUTE = `${PATIENT_ROUTE}/get-patient-by-object-id`;
export const GET_ALL_PAT_ROUTE = `${PATIENT_ROUTE}/all-patients`;
export const UPDATE_PAT_BY_ID_ROUTE = `${PATIENT_ROUTE}/update-patient`;

// Pre Therapy for Patient
export const PRE_THERAPY_ROUTE = `${HOST}/pre_therapy`;
export const GET_PATIENT_FROM_ID = `${PRE_THERAPY_ROUTE}/get-pre-therapy-user`;
export const UPLOAD_PRE_THERAPY_DETAILS = `${PRE_THERAPY_ROUTE}/upload-pre-therapy`;

// Student Therapists
export const STUDENT_THERAPIST_ROUTE = `${HOST}/student-therapist`;
export const ADD_STUDENT_THERAPIST_ROUTE = `${STUDENT_THERAPIST_ROUTE}/add-student`;
export const GET_STT_BY_ID_ROUTE = `${STUDENT_THERAPIST_ROUTE}/get-student-by-id`;
export const GET_STT_BY_OBJECT_ID_ROUTE = `${STUDENT_THERAPIST_ROUTE}/get-student-by-object-id`;
export const GET_ALL_STT_ROUTE = `${STUDENT_THERAPIST_ROUTE}/get-all-students`;
export const UPDATE_STT_BY_ID_ROUTE = `${STUDENT_THERAPIST_ROUTE}/update-student`;

// Supervisors
export const SUPERVISOR_ROUTE = `${HOST}/supervisor`;
export const ADD_SUPERVISOR_ROUTE = `${SUPERVISOR_ROUTE}/add-supervisor`;
export const GET_SUP_BY_ID_ROUTE = `${SUPERVISOR_ROUTE}/get-supervisor-by-id`;
export const GET_SUP_BY_OBJECT_ID_ROUTE = `${SUPERVISOR_ROUTE}/get-supervisor-by-object-id`;
export const GET_ALL_SUP_ROUTE = `${SUPERVISOR_ROUTE}/get-all-supervisors`;
export const UPDATE_SUP_BY_ID_ROUTE = `${SUPERVISOR_ROUTE}/update-supervisor`;

//Contacts
export const CONTACTS_ROUTE = `${HOST}/contacts`;
export const GET_CONTACTS = `${CONTACTS_ROUTE}/get-contacts`;
export const GET_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-contacts`;

//Messages
export const MESSAGES_ROUTE = `${HOST}/messages`;
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;

// Calendar
export const CALENDAR_ROUTE = `${HOST}/calendar`;
export const ADD_CALENDAR_EVENT_ROUTE = `${CALENDAR_ROUTE}/add-calendar-event`;
export const GET_USER_CALENDAR_EVENTS_ROUTE = `${CALENDAR_ROUTE}/get-calendar-events`;
export const GET_USER_OBJ_ID = `${CALENDAR_ROUTE}/get-user-obj-id`;
export const UPDATE_EVENT_BY_ID = `${CALENDAR_ROUTE}/update-event`;

// Sessions
export const SESSION_ROUTE = `${HOST}/sessions`;
export const ADD_SESSION_ROUTE = `${SESSION_ROUTE}/add-session`;
export const GET_ALL_SESSIONS_ROUTE = `${SESSION_ROUTE}/get-all-sessions`;
export const GET_ALL_SESSIONS_BY_THERAPIST = `${SESSION_ROUTE}/get-sessions-by-student-therapist-id`;
export const GET_ALL_SESSIONS_BY_THERAPIST_PATIENT = `${SESSION_ROUTE}/get-sessions-by-therapist-patient-id`;

// Matchmaking
export const MATCHMAKING_ROUTE = `${HOST}/matchmaking`;
export const GET_UNALLOCATED_PATIENTS = `${MATCHMAKING_ROUTE}/get-unallocated-patients`;
export const ALLOCATING_PATIENTS_ROUTE = `${MATCHMAKING_ROUTE}/match-patients`;

// Reports
export const REPORT_ROUTE = `${HOST}/report`;
export const ADD_REPORT_ROUTE = `${REPORT_ROUTE}/generate-report`;
export const GET_ALL_REPORTS = `${REPORT_ROUTE}/get-all-reports`;

// Onboarding
export const ONBOARDING_ROUTE = `${HOST}/onboarding`;
export const CHECK_ONBOARDING_STATUS_ROUTE = `${ONBOARDING_ROUTE}/check-onboarding-status`;
export const ONBOARD_AUTH_USER_ROUTE = `${ONBOARDING_ROUTE}/onboard-auth-user`;

// Admin
export const ADMIN_ROUTE = `${HOST}/admin`;
export const GET_ADM_BY_ID_ROUTE = `${ADMIN_ROUTE}/get-admin-by-id`;
export const GET_ALL_ADM_ROUTE = `${ADMIN_ROUTE}/get-all-admins`;
export const ADD_ADMIN_ROUTE = `${ADMIN_ROUTE}/add-admin`;

// HOD
export const HOD_ROUTE = `${HOST}/hod`;
export const GET_HOD_BY_ID_ROUTE = `${HOD_ROUTE}/get-hod-by-id`;
export const GET_ALL_HOD_ROUTE = `${HOD_ROUTE}/get-all-hods`;

// Reasons
export const REASONS_ROUTE = `${HOST}/reasons`;
export const TERMINATION_ROUTE = `${REASONS_ROUTE}/terminate-patient`;
export const TRANSFER_ROUTE = `${REASONS_ROUTE}/transfer-patient`;
