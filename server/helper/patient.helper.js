import crypto from 'crypto';

const ROLE_PREFIXES = {
    patient: 'PAT',
    studentTherapist: 'STT',
    supervisor: 'SUP'
};

export const generateEncryptedUniqueId = (role) => {
    const rolePrefix = ROLE_PREFIXES[role];
    if (!rolePrefix) {
        throw new Error('Invalid role specified. Must be "Patient", "Student Therapist", or "Supervisor".');
    }

    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const structuredId = `${rolePrefix}-${timestamp}-${randomString}`;

    const hash = crypto.createHash('sha256').update(structuredId).digest('hex');

    const numericId = BigInt(`0x${hash}`).toString().slice(0, 20);

    return numericId;
};