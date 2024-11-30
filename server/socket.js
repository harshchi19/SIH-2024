import { Server as SocketIOServer } from "socket.io";
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

  const sendMessage = async (messageData) => {
    try {
      // Create message
      const newMessage = await Message.create({
        sender: messageData.sender,
        recipient: messageData.recipient,
        messageType: messageData.messageType,
        content: messageData.content,
      });

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

  io.on("connection", (socket) => {
    // const userId = socket.handshake.query.userId;

    // if (!userId) {
    //   socket.emit("error", "User ID is required");
    //   return;
    // }

    userSocketMap.set(socket.id);
    console.log(`User connected with socket ID: ${socket.id}`);

    // Emit a "connected" event to notify the user that the connection is successful
    socket.emit("connected", { message: "You are successfully connected!" });

    socket.on("sendMessage", sendMessage);

    socket.on("disconnect", () => {
      //   userSocketMap.delete(userId);
      console.log(`User disconnected`);
    });
  });

  return io;
};

export default setupSocket;
