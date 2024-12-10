import crypto from "crypto";

const ROLE_PREFIXES = {
  pat: "PAT",
  stt: "STT",
  sup: "SUP",
};

// Generating Unique IDs for all users
export const generateEncryptedUniqueId = (role) => {
  const rolePrefix = ROLE_PREFIXES[role];
  if (!rolePrefix) {
    throw new Error(
      'Invalid role specified. Must be "Patient", "Student Therapist", or "Supervisor".'
    );
  }

  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  const structuredId = `${rolePrefix}-${timestamp}-${randomString}`;

  return structuredId;
};

// Encrypting and Decrypting Data
export const generateKeyAndIV = () => {
  const iv = crypto.randomBytes(12);

  return iv;
};

export const encryptPatientData = (data, key, iv) => {
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
};

export const decryptPatientData = (encryptedData, key, iv, authTag) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};

// For generating unique case number
export const generateUniqueCaseNo = () => {
  const timestamp = Date.now();

  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();

  const caseNo = `CASE-${timestamp}-${randomString}`;

  return caseNo;
};

// Encrypt a section
export const encryptSection = (section, key, iv) => {
  const encryptedSection = {};

  for (const [item, value] of Object.entries(section)) {
    let modifiedValue = value;
    if (typeof value !== "string") {
      modifiedValue = JSON.stringify(value);
    } else {
      modifiedValue = value === null ? "" : value;
    }

    const encryptedValue = encryptPatientData(modifiedValue, key, iv);
    encryptedSection[item] = encryptedValue;
  }

  return encryptedSection;
};

// Decrypt a section
export const decryptSection = (section, key) => {
  const decryptedSection = {};
  for (const [item, value] of Object.entries(section)) {
    if (typeof value === "string" || Array.isArray(value) || item === "_id") {
      decryptedSection[item] = value;
    } else {
      const decryptedValue = decryptPatientData(
        value.encryptedData,
        key,
        value.iv,
        value.authTag
      );
      decryptedSection[item] = decryptedValue;
    }
  }

  return decryptedSection;
};

// Hash data for identifiers
export const generateHashedData = (data) => {
  const hash = crypto.createHash("sha256").update(data).digest("hex");

  return hash;
};
