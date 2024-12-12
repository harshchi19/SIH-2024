import { AuthEmail } from "../models/mongo/auth_email.model.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import {
  encryptSection,
  generateHashedData,
  generateKeyAndIV,
} from "../helper/security.helper.js";
import { unwrapKey } from "./keys.controller.js";

export const addAuthUser = async (req, res, next) => {
  const { email, password, userType } = req.body;

  try {
    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "auth_emails",
    });
    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const dataForAuth = {
      email,
      password,
    };

    const iv = generateKeyAndIV();

    const encryptedDetails = encryptSection(dataForAuth, key, iv);

    const hashedEmailId = generateHashedData(email);

    const newAuthUser = new AuthEmail({
      email: encryptedDetails.email,
      hash_email: hashedEmailId,
      password: encryptedDetails.password,
      userType: userType,
    });

    newAuthUser.save();

    return res.status(200).json({ message: "User has been stored" });
  } catch (error) {
    console.error(`Error in getUnallocatedPatients: ${error}`);
    return res.status(500).json({ message: "int-ser-err" });
  }
};
