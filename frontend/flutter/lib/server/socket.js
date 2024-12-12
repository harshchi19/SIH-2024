import { disconnect } from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import crypto from "crypto";
import { Messages } from "./models/mongo/message.model.js";
import { Supervisor } from "./models/mongo/supervisor.model.js";
import { StudentTherapist } from "./models/mongo/student_therapist.model.js";
import { Patient } from "./models/mongo/patient.model.js";
import { generateHashedData } from "./helper/security.helper.js";
// import Message from "./models/mongo/communication.model.js";

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
    const hashedId = generateHashedData(id); // Hash the ID using your function

    let user = null;

    switch (type) {
      case "supervisor":
        user = await Supervisor.findOne({ hashedId });
        break;
      case "student":
        user = await Student.findOne({ hashedId });
        break;
      case "therapist":
        user = await Therapist.findOne({ hashedId });
        break;
      case "patient":
        user = await Patient.findOne({ hashedId });
        break;
      default:
        throw new Error("Invalid user type");
    }

    if (!user) throw new Error(`${type} not found for hashedId: ${hashedId}`);

    return user._id; // Return ObjectId of the user
  };

  const sendMessage = async (messageData) => {
    try {
      const senderId = await hashAndFindUser(
        messageData.sender,
        messageData.senderType
      );
      const recipientId = await hashAndFindUser(
        messageData.recipient,
        messageData.recipientType
      );
      // Create message
      // const newMessage = await Message.create({
      //   sender: messageData.sender,
      //   recipient: messageData.recipient,
      //   recipientType: messageData.recipientType,
      //   senderType: messageData.senderType,
      //   messageType: messageData.messageType,
      //   content: messageData.content,
      // });

      // Populate sender and recipient details
      const populatedMessage = await Message.findById(newMessage._id)
        .populate("sender", "name email")
        .populate("recipient", "name email");

      // Get socket IDs for sender and recipient
      const senderSocketId = userSocketMap.get(messageData.sender.toString());
      const recipientSocketId = messageData.recipient
        ? userSocketMap.get(messageData.recipient.toString())
        : null;

      // Emit message to sender and recipient if they're online
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", populatedMessage);
      }

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", populatedMessage);
      }

      return populatedMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };
  const disconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      socket.emit("error", "User ID is required");
      return;
    }
  });
  // Emit a "connected" event to notify the user that the connection is successful
  // socket.emit("connected", { message: "You are successfully connected!" });

  // socket.on("sendMessage", sendMessage);

  io.on("disconnect", () => disconnect(socket));

  // return io;
};

export default setupSocket;
