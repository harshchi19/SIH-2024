import {
  decryptSection,
  generateHashedData,
} from "../helper/security.helper.js";
import { Admin } from "../models/mongo/admin.model.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";

export const getAdminById = async (req, res, next) => {
  const { admin_id } = req.params;

  try {
    const hashedAdminId = generateHashedData(admin_id);

    const admin = await Admin.findOne({
      admin_id_hash: hashedAdminId,
    });

    if (!admin) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "admins",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptData = {
      _id: admin._id,
      admin_id: Object.fromEntries(admin.admin_id),
      name: Object.fromEntries(admin.name),
      email: Object.fromEntries(admin.email),
      phone_no: Object.fromEntries(admin.phone_no),
      date_of_birth: Object.fromEntries(admin.date_of_birth),
      age: Object.fromEntries(admin.age),
      sex: Object.fromEntries(admin.sex),
      department: Object.fromEntries(admin.department),
      qualifications: Object.fromEntries(admin.qualifications),
      user_image: Object.fromEntries(admin.user_image),
    };

    console.log(decryptData);

    const decryptedData = decryptSection(decryptData, key);

    decryptedData.authenticated = admin.authenticated;

    console.log(decryptedData);

    return res.status(200).json(decryptedData);
  } catch (error) {
    console.error("Error in getAdminById: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};
export const getAdminObjectById = async (req, res, next) => {
  const { admin_id } = req.params;

  try {
    const admin = await Admin.findOne({
      _id: admin_id,
    });

    if (!admin) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "admins",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptData = {
      _id: admin._id,
      admin_id: Object.fromEntries(admin.admin_id),
      name: Object.fromEntries(admin.name),
      email: Object.fromEntries(admin.email),
      phone_no: Object.fromEntries(admin.phone_no),
      date_of_birth: Object.fromEntries(admin.date_of_birth),
      age: Object.fromEntries(admin.age),
      sex: Object.fromEntries(admin.sex),
      department: Object.fromEntries(admin.department),
      qualifications: Object.fromEntries(admin.qualifications),
      user_image: Object.fromEntries(admin.user_image),
    };

    console.log(decryptData);

    const decryptedData = decryptSection(decryptData, key);

    decryptedData.authenticated = admin.authenticated;

    console.log(decryptedData);

    return res.status(200).json(decryptedData);
  } catch (error) {
    console.error("Error in getAdminById: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find({});

    if (!admins) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "admins",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptedData = admins.map((admin) => {
      const decryptData = {
        _id: admin._id,
        admin_id: Object.fromEntries(admin.admin_id),
        name: Object.fromEntries(admin.name),
        email: Object.fromEntries(admin.email),
        phone_no: Object.fromEntries(admin.phone_no),
        date_of_birth: Object.fromEntries(admin.date_of_birth),
        age: Object.fromEntries(admin.age),
        sex: Object.fromEntries(admin.sex),
        department: Object.fromEntries(admin.department),
        qualifications: Object.fromEntries(admin.qualifications),
        user_image: Object.fromEntries(admin.user_image),
      };

      return decryptSection(decryptData, key);
    });

    return res.status(200).json(decryptedData);
  } catch (error) {
    console.error("Error in getAdminById: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};
