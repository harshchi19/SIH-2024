import crypto from "crypto";

export const generateMasterKey = async (req, res, next) => {
    const masterKey = Buffer.from(process.env.MASTER_KEY, 'base64');

    const keyToWrap = crypto.randomBytes(32);
    const wrappedKey = wrapKey(keyToWrap, masterKey);
    console.log(wrappedKey);
};

const wrapKey = (keyToWrap, masterKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);

    const encryptedKey = Buffer.concat([
        cipher.update(keyToWrap),
        cipher.final(),
    ]);

    return {
        wrappedKey: encryptedKey.toString('base64'),
        iv: iv.toString('base64'),
        authTag: cipher.getAuthTag().toString('base64'),
    };
};

export const unwrapKey = (wrappedKey, iv, authTag) => {
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(process.env.MASTER_KEY, 'base64'), Buffer.from(iv, 'base64'));

    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    const decryptedKey = Buffer.concat([
        decipher.update(Buffer.from(wrappedKey, 'base64')),
        decipher.final(),
    ]);

    return decryptedKey;
};