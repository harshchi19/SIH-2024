// For Reference, directly insert the schema in the database

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const encryptionKeySchema = new Schema({
    collectionName: {
        type: String,
        required: true,
        unique: true
    },
    encryptedKey: {
        type: String,
        required: true
    },
    encryptedIV: {
        type: String,
        required: true
    },
    encryptedAuthTag: {
        type: String,
        required: true
    }
});

export const EncryptionKey = mongoose.model('encryption_key', encryptionKeySchema);