// import { disconnect } from "mongoose";
// import { Server as SocketIOServer } from "socket.io";
// import crypto from "crypto";
// import { Messages } from "./models/mongo/message.model.js";
// import { Supervisor } from "./models/mongo/supervisor.model.js";
// import { StudentTherapist } from "./models/mongo/student_therapist.model.js";
// import { Patient } from "./models/mongo/patient.model.js";
// import { EncryptionKey } from "./models/mongo/keys.model.js";
// import {
//   generateKeyAndIV,
//   encryptSection,
//   generateHashedData,
// } from "./helper/security.helper.js";
// import { unwrapKey } from "./controllers/keys.controller.js";
// // import Message from "./models/mongo/communication.model.js";

// const setupSocket = (server) => {
//   const io = new SocketIOServer(server, {
//     cors: {
//       origin: process.env.WEB_URL || "http://localhost:3000",
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//   });

//   const userSocketMap = new Map();

//   const hashAndFindUser = async (id, type) => {
//     const hashedId = generateHashedData(id); // Hash the ID using your function

//     let user = null;

//     switch (type) {
//       case "SUP":
//         user = await Supervisor.findOne({ hashedId });
//         break;
//       case "STT":
//         user = await StudentTherapist.findOne({ hashedId });
//         break;
//       case "PAT":
//         user = await Patient.findOne({ hashedId });
//         break;
//       default:
//         throw new Error("Invalid user type");
//     }

//     if (!user) throw new Error(`${type} not found for hashedId: ${hashedId}`);

//     return user._id; // Return ObjectId of the user
//   };

//   const sendMessage = async (messageData) => {
//     try {
//       const findEncryptionKey = await EncryptionKey.findOne({
//         collectionName: "communications",
//       });
//       const key = unwrapKey(
//         findEncryptionKey.encryptedKey,
//         findEncryptionKey.encryptedIV,
//         findEncryptionKey.encryptedAuthTag
//       );
//       const encryptedMessageContent = encryptSection(messageData.content, key);

//       const senderType = messageData.userId.split("-")[0]; // Extract sender type from userId
//       const recipientType = messageData.recipientId.split("-")[0]; // Extract recipient type from userId

//       const senderId = await hashAndFindUser(messageData.sender, senderType);
//       const recipientId = await hashAndFindUser(
//         messageData.recipient,
//         recipientType
//       );

//       // Create message without population
//       const newMessage = await Messages.create({
//         sender: senderId,
//         recipient: recipientId,
//         recipientType,
//         senderType,
//         messageType: messageData.messageType,
//         content: encryptedMessageContent,
//         timeStamp: Date.now(),
//       });

//       // Get socket IDs for sender and recipient
//       const senderSocketId = userSocketMap.get(messageData.sender.toString());
//       const recipientSocketId = messageData.recipient
//         ? userSocketMap.get(messageData.recipient.toString())
//         : null;

//       // Emit message to sender and recipient if they're online
//       if (senderSocketId) {
//         io.to(senderSocketId).emit("receiveMessage", newMessage); // Send raw message data
//       }

//       if (recipientSocketId) {
//         io.to(recipientSocketId).emit("receiveMessage", newMessage); // Send raw message data
//       }

//       return newMessage; // Return the message data without population
//     } catch (error) {
//       console.error("Error sending message:", error);
//       throw error;
//     }
//   };

//   const handleDisconnect = (socket) => {
//     console.log(`Client disconnected: ${socket.id}`);
//     for (const [userId, socketId] of userSocketMap.entries()) {
//       if (socketId === socket.id) {
//         userSocketMap.delete(userId);
//         break;
//       }
//     }
//   };
//   io.on("connection", (socket) => {
//     const userId = socket.handshake.query.userId;

//     if (userId) {
//       userSocketMap.set(userId, socket.id);
//       console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
//     } else {
//       socket.emit("error", "User ID is required");
//       return;
//     }

//     socket.on("sendMessage", async (messageData) => {
//       try {
//         const message = await sendMessage(messageData);
//         console.log("Message sent:", message);
//       } catch (error) {
//         console.error("Error processing sendMessage:", error);
//         socket.emit("error", "Error sending message");
//       }
//     });

//     io.on("disconnect", () => disconnect(socket));
//   });

//   // return io;
// };

// export default setupSocket;

import { Server as SocketIOServer } from "socket.io";
import { Messages } from "./models/mongo/message.model.js";
import { Supervisor } from "./models/mongo/supervisor.model.js";
import { StudentTherapist } from "./models/mongo/student_therapist.model.js";
import { Patient } from "./models/mongo/patient.model.js";
import { EncryptionKey } from "./models/mongo/keys.model.js";
import {
  generateKeyAndIV,
  encryptSection,
  generateHashedData,
  decryptSection,
} from "./helper/security.helper.js";
import { unwrapKey } from "./controllers/keys.controller.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.WEB_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const hashAndFindUser = async (id, type) => {
    const hashedId = generateHashedData(id);

    let user = null;
    switch (type) {
      case "SUP":
        user = await Supervisor.findOne({
          supervisor_id_hash: hashedId,
        });
        break;
      case "STT":
        user = await StudentTherapist.findOne({
          student_therapist_id_hash: hashedId,
        });
        break;
      case "PAT":
        user = await Patient.findOne({
          patient_id_hash: hashedId,
        });
        break;
      default:
        throw new Error("Invalid user type");
    }

    if (!user) throw new Error(`${type} not found for hashedId: ${hashedId}`);
    return user._id;
  };

  const sendMessage = async (messageData) => {
    try {
      const findEncryptionKey = await EncryptionKey.findOne({
        collectionName: "communications",
      });
      const key = unwrapKey(
        findEncryptionKey.encryptedKey,
        findEncryptionKey.encryptedIV,
        findEncryptionKey.encryptedAuthTag
      );
      const iv = generateKeyAndIV();
      const messageContent = { message: messageData.content };
      const encryptedMessageContent = encryptSection(messageContent, key, iv);
      console.log("Message Data Recieved:", messageData);
      // console.log("Encrypted Content", encryptedMessageContent);

      const senderType = messageData.sender.split("-")[0];
      const recipientType = messageData.recipient.split("-")[0];

      const senderId = await hashAndFindUser(messageData.sender, senderType);
      const recipientId = await hashAndFindUser(
        messageData.recipient,
        recipientType
      );

      const newMessage = new Messages({
        sender_id: senderId,
        recipient_id: recipientId,
        recipientType,
        senderType,
        messageType: messageData.messageType,
        content: encryptedMessageContent.message,
      });

      await newMessage.save();

      const decryptedMessageContent = decryptSection(
        encryptedMessageContent,
        key
      );

      const messageToEmit = {
        sender: messageData.sender,
        recipient: messageData.recipient,
        content: messageData.content, // Replace with decrypted content
      };
      console.log("Message EMitted:", messageToEmit);

      // Emit the message to both sender and recipient
      const senderSocketId = userSocketMap.get(messageData.sender);
      const recipientSocketId = userSocketMap.get(messageData.recipient);

      // if (senderSocketId) {
      //   io.to(senderSocketId).emit("receiveMessage", messageToEmit);
      // }
      console.log("Recipient", recipientSocketId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageToEmit);
      }

      return messageToEmit;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      console.log("UserMao", userSocketMap);
      if (userSocketMap.has(userId)) {
        console.log(
          `User ${userId} already connected, socket ID: ${socket.id}`
        );
        // Optionally handle reconnection or disconnection logic here
      } else {
        userSocketMap.set(userId, socket.id);
        console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
      }
    } else {
      socket.emit("error", "User ID is required");
      return;
    }

    socket.on("sendMessage", async (messageData) => {
      try {
        const message = await sendMessage(messageData);
        // console.log("Message sent:", message);
      } catch (error) {
        console.error("Error processing sendMessage:", error);
        socket.emit("error", "Error sending message");
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
};

export default setupSocket;
