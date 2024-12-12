import mongoose, { Schema } from "mongoose";

const HODSchema = new Schema({
  hod_id: {
    type: Map,
    of: String,
    required: true,
  },
  name: {
    type: Map,
    of: String,
  },
  password: {
    type: Map,
    of: String,
  },
  phone_no: {
    type: Map,
    of: String,
  },
  email: {
    type: Map,
    of: String,
  },
  date_of_birth: {
    type: Map,
    of: String,
  },
  age: {
    type: Map,
    of: String,
  },
  sex: {
    type: Map,
    of: String,
  },
  department: {
    type: Map,
    of: String,
  },
  qualifications: {
    type: Map,
    of: String,
  },
  user_image: {
    type: Map,
    of: String,
  },
  hash_hod_id: {
    type: String,
  },
  email_hash: {
    type: String,
  },
  phone_hash: {
    type: String,
  },
  authenticated: {
    type: String,
    default: false,
  },
});

export const HeadOfDepartment = mongoose.model("hod", HODSchema);
