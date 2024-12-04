// import { Messages } from "../models/mongo/message.model.js";
// import { unwrapKey } from "./keys.controller";
// import { EncryptionKey } from "../models/mongo/keys.model.js";
// import {
//   decryptSection,
//   generateHashedData,
// } from "../helper/security.helper.js";
// import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
// import { Supervisor } from "../models/mongo/supervisor.model.js";
// import { Patient } from "../models/mongo/patient.model.js";

// export const getMessages = async (req, res, next) => {
//   try {
//     let user1 = await req.params;
//     let user2 = req.body.id;
//     let messages = {};
//     const user1Type = user1.split("-")[0];
//     const user2Type = user2.split("-")[0];

//     const hashedUser1Id = generateHashedData(user1);
//     const hashedUser2Id = generateHashedData(user2);
//     if (!user1 || !user2) {
//       return response.status(400).send("Both user ids are required required.");
//     }
//     if (userType === "SUP") {
//       return "supervisors";
//     } else if (userType === "STT") {
//       return "student-therapists";
//     } else if (userType === "PAT") {
//       return "patients";
//     } else {
//       return res.status(400).json({ message: "Invalid user type" });
//     }
//   } catch {}
// };

import { Messages } from "../models/mongo/message.model.js";
import { unwrapKey } from "./keys.controller.js";
import { EncryptionKey } from "../models/mongo/keys.model.js";
import {
  decryptSection,
  generateHashedData,
} from "../helper/security.helper.js";
import { StudentTherapist } from "../models/mongo/student_therapist.model.js";
import { Supervisor } from "../models/mongo/supervisor.model.js";
import { Patient } from "../models/mongo/patient.model.js";

export const getMessages = async (req, res, next) => {
  try {
    const { user1Id, user2Id } = req.params;
    // console.log("Users:", user1Id, user2Id);

    if (!user1Id || !user2Id) {
      return res.status(400).send("Both user ids are required.");
    }

    // Generate hashed user IDs
    const user1Type = user1Id.split("-")[0]; // Extract user type from the ID
    const user2Type = user2Id.split("-")[0]; // Extract user type from the ID
    const hashedUser1Id = generateHashedData(user1Id);
    const hashedUser2Id = generateHashedData(user2Id);

    // Find the users based on hashed IDs
    let user1Record, user2Record;
    switch (user1Type) {
      case "SUP":
        user1Record = await Supervisor.findOne({
          supervisor_id_hash: hashedUser1Id,
        }).select("_id");
        break;
      case "STT":
        user1Record = await StudentTherapist.findOne({
          student_therapist_id_hash: hashedUser1Id,
        }).select("_id");
        break;
      case "PAT":
        user1Record = await Patient.findOne({
          patient_id_hash: hashedUser1Id,
        }).select("_id");
        break;
      default:
        return res.status(400).json({ message: "Invalid user1 type" });
    }

    switch (user2Type) {
      case "SUP":
        user2Record = await Supervisor.findOne({
          supervisor_id_hash: hashedUser2Id,
        });
        break;
      case "STT":
        user2Record = await StudentTherapist.findOne({
          student_therapist_id_hash: hashedUser2Id,
        });
        break;
      case "PAT":
        user2Record = await Patient.findOne({ patient_id_hash: hashedUser2Id });
        break;
      default:
        return res.status(400).json({ message: "Invalid user2 type" });
    }
    if (!user1Record || !user2Record) {
      return res.status(404).json({ message: "One or both users not found" });
    }
    // console.log(user1Record._id, user2Record._id);
    // Retrieve messages between the two users
    const messages = await Messages.find({
      $or: [
        { sender_id: user1Record._id, recipient_id: user2Record._id },
        { sender_id: user2Record._id, recipient_id: user1Record._id },
      ],
    }).sort({ createdAt: 1 });

    // console.log(messages);

    // If messages exist, decrypt them
    const encryptionKey = await EncryptionKey.findOne({
      collectionName: "communications",
    });
    const key = unwrapKey(
      encryptionKey.encryptedKey,
      encryptionKey.encryptedIV,
      encryptionKey.encryptedAuthTag
    );

    const decryptedMessages = messages.map((msg) => {
      console.log("message ", msg.content);
      const decryptedContent = decryptSection(
        { message: Object.fromEntries(msg.content) },
        key
      );

      return {
        sender_id: msg.sender_id,
        recipient_id: msg.recipient_id,
        content: decryptedContent.message,
        messageType: msg.messageType,
        timestamp: msg.createdAt,
      };
    });
    console.log("messages:", decryptedMessages);
    // Return the decrypted messages as JSON
    return res.status(200).json({ messages: decryptedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};
