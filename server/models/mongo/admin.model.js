import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  admin_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  password: {
    type: Map,
    of: String,
    required: true,
  },
  phone_no: {
    type: Map,
    of: String,
    required: true,
  },
  email: {
    type: Map,
    of: String,
    required: true,
  },
  date_of_birth: {
    type: Map,
    of: String,
    required: true,
  },
  age: {
    type: Map,
    of: String,
    required: true,
  },
  sex: {
    type: Map,
    of: String,
    required: true,
    enum: ["M", "F", "O"],
  },
  department: {
    type: Map,
    of: String,
    required: true,
  },
  qualifications: {
    type: Map,
    of: String,
    required: true,
  },
  user_image: {
    type: Map,
    of: String,
  },
  email_hash: {
    type: String,
    required: true,
  },
  phone_hash: {
    type: String,
    required: true,
  },
  authenticated: {
    type: String,
    required: true,
    default: false,
  },
  blob_storage_path: {
    type: String,
    default: "",
  },
  allocated_therapists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentTherapist",
      default: null,
    },
  ],
});

export const Admin = mongoose.model("", Administration);
