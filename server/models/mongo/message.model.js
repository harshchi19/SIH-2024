import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  recipient_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  senderType: {
    type: String,
    required: true,
  },
  recipientType: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: Map,
    of: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

export const Messages = mongoose.model("Message", messageSchema);
