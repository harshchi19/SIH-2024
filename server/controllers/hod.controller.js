import {
  decryptSection,
  generateHashedData,
} from "../helper/security.helper.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";
import { HeadOfDepartment } from "../models/mongo/hod.model.js";

export const getHodById = async (req, res, next) => {
  const { hod_id } = req.params;
  try {
    const hashedHodId = generateHashedData(hod_id);
    const hod = await HeadOfDepartment.findOne({
      hash_hod_id: hashedHodId,
    });

    if (!hod) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "hods",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptData = {
      _id: hod._id,
      hod_id: Object.fromEntries(hod.hod_id),
      name: Object.fromEntries(hod.name),
      email: Object.fromEntries(hod.email),
      phone_no: Object.fromEntries(hod.phone_no),
      date_of_birth: Object.fromEntries(hod.date_of_birth),
      age: Object.fromEntries(hod.age),
      sex: Object.fromEntries(hod.sex),
      department: Object.fromEntries(hod.department),
      qualifications: Object.fromEntries(hod.qualifications),
      user_image: Object.fromEntries(hod.user_image),
    };

    const decryptedData = decryptSection(decryptData, key);

    decryptedData.authenticated = hod.authenticated;

    return res.status(200).json(decryptedData);
  } catch (error) {
    console.error("Error in getHodById: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const getHodObjectById = async (req, res, next) => {
  const { hod_id } = req.params;
  try {
    const hod = await HeadOfDepartment.findOne({
      _id: hod_id,
    });

    if (!hod) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "hods",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptData = {
      _id: hod._id,
      hod_id: Object.fromEntries(hod.hod_id),
      name: Object.fromEntries(hod.name),
      email: Object.fromEntries(hod.email),
      phone_no: Object.fromEntries(hod.phone_no),
      date_of_birth: Object.fromEntries(hod.date_of_birth),
      age: Object.fromEntries(hod.age),
      sex: Object.fromEntries(hod.sex),
      department: Object.fromEntries(hod.department),
      qualifications: Object.fromEntries(hod.qualifications),
      user_image: Object.fromEntries(hod.user_image),
    };

    const decryptedData = decryptSection(decryptData, key);

    decryptedData.authenticated = hod.authenticated;

    return res.status(200).json(decryptedData);
  } catch (error) {
    console.error("Error in getHodById: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};

export const getAllHods = async (req, res, next) => {
  try {
    const hods = await HeadOfDepartment.find();

    if (!hods) {
      return res.status(400).json({ message: "usr-not-fnd" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: "hods",
    });

    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const decryptedData = hods.map((hod) => {
      const decryptData = {
        _id: hod._id,
        hod_id: Object.fromEntries(hod.hod_id),
        name: Object.fromEntries(hod.name),
        email: Object.fromEntries(hod.email),
        phone_no: Object.fromEntries(hod.phone_no),
        date_of_birth: Object.fromEntries(hod.date_of_birth),
        age: Object.fromEntries(hod.age),
        sex: Object.fromEntries(hod.sex),
        department: Object.fromEntries(hod.department),
        qualifications: Object.fromEntries(hod.qualifications),
        user_image: Object.fromEntries(hod.user_image),
      };

      return decryptSection(decryptData, key);
    });

    return res.status(200).json(decryptedData);
  } catch (error) {
    console.error("Error in getAllHods: ", error);
    return res.status(400).json({ message: "int-ser-err" });
  }
};
