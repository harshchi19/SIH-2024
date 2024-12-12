import mongoose, { Schema } from "mongoose";

const authEmailSchema = new Schema({
  email: {
    type: Map,
    of: String,
    required: true,
  },
  hash_email: {
    type: String,
    required: true,
  },
  password: {
    type: Map,
    of: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
});

export const AuthEmail = mongoose.model("auth_email", authEmailSchema);
