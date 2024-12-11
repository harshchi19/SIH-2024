import { HeadOfDepartment } from "../models/mongo/hod.model.js";
import { Admin } from "../models/mongo/admin.model.js";
import { AuthEmail } from "../models/mongo/auth_email.model.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import { unwrapKey } from "./keys.controller.js";
import {
  decryptSection,
  encryptSection,
  generateHashedData,
  generateKeyAndIV,
} from "../helper/security.helper.js";

export const onboardingAuthUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
    phone_no,
    date_of_birth,
    department,
    qualifications,
    sex,
    userId,
    userType,
  } = req.body;

  try {
    const hashedUserId = generateHashedData(userId);

    let UserModel, encryptionCollection, hashedIdField;
    if (userType === "ADM") {
      UserModel = Admin;
      encryptionCollection = "admins";
      hashedIdField = "admin_id_hash";
    } else if (userType === "HOD") {
      UserModel = HeadOfDepartment;
      encryptionCollection = "hods";
      hashedIdField = "hod_id_hash";
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const existingUser = await UserModel.findOne({
      [hashedIdField]: hashedUserId,
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "You are not an authenticated user" });
    }

    const findEncryptionKey = await EncryptionKey.findOne({
      collectionName: encryptionCollection,
    });
    const key = unwrapKey(
      findEncryptionKey.encryptedKey,
      findEncryptionKey.encryptedIV,
      findEncryptionKey.encryptedAuthTag
    );

    const iv = generateKeyAndIV();

    const dob = new Date(date_of_birth);
    if (isNaN(dob.getTime())) {
      console.error("Date of Birth is not valid");
      return res.status(400).json({ message: "Invalid Date" });
    }

    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const isBirthdayPassed =
      now.getMonth() > dob.getMonth() ||
      (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());

    if (!isBirthdayPassed) {
      age--;
    }

    const userDetails = {
      name,
      email,
      password,
      phone_no,
      date_of_birth,
      department,
      qualifications,
      sex,
      user_image: "",
      age,
    };

    const encryptedDetails = encryptSection(userDetails, key, iv);

    existingUser.name = encryptedDetails.name;
    existingUser.email = encryptedDetails.email;
    existingUser.password = encryptedDetails.password;
    existingUser.phone_no = encryptedDetails.phone_no;
    existingUser.date_of_birth = encryptedDetails.date_of_birth;
    existingUser.department = encryptedDetails.department;
    existingUser.qualifications = encryptedDetails.qualifications;
    existingUser.sex = encryptedDetails.sex;
    existingUser.age = encryptedDetails.age;
    (existingUser.user_image = encryptedDetails.user_image),
      (existingUser.authenticated = true);

    await existingUser.save();

    return res.status(200).json({ message: "Details updated successfully!" });
  } catch (error) {
    console.error("Error in onboardingAuthUser: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkOnboardingStatus = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const hashedUserId = generateHashedData(userId);

    // Check if user exists in Head of Department collection
    const existingHOD = await HeadOfDepartment.findOne({
      hash_hod_id: hashedUserId,
    }).select("_id name");

    if (existingHOD?.name) {
      return res.status(200).json({
        success: true,
        userType: "head-of-department",
        userId: existingHOD._id,
      });
    }

    // Check if user exists in Admin collection
    const existingAdmin = await Admin.findOne({
      admin_id_hash: hashedUserId,
    }).select("_id name");

    if (existingAdmin?.name) {
      return res.status(200).json({
        success: true,
        userType: "admin",
        userId: existingAdmin._id,
      });
    }

    // If user is not found, check in AuthEmail collection
    const authUser = await AuthEmail.findOne({ userId: userId }).select(
      "email password"
    );
    if (!authUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prepare and decrypt authentication details
    const authUserDetails = {
      email: Object.fromEntries(authUser.email),
      password: Object.fromEntries(authUser.password),
    };

    const encryptionKeyData = await EncryptionKey.findOne({
      collectionName: "auth_emails",
    });

    if (!encryptionKeyData) {
      return res.status(500).json({
        success: false,
        message: "Encryption key not found",
      });
    }

    const key = unwrapKey(
      encryptionKeyData.encryptedKey,
      encryptionKeyData.encryptedIV,
      encryptionKeyData.encryptedAuthTag
    );

    const decryptedDetails = decryptSection(authUserDetails, key);

    // Respond with decrypted email and password
    return res.status(200).json({
      success: false,
      message: "User not found in primary collections",
      email: decryptedDetails.email,
      password: decryptedDetails.password,
    });
  } catch (error) {
    console.error("Error in checkOnboardingStatus: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
