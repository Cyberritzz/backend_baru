import mongoose from "mongoose";
import moment from "moment-timezone";
import modelConstanta from "./modelConstanta.js";

const schemaUser = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  joined_at: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Bangkok"),
  },
  is_membership: {
    type: String,
    required: true,
    enum: {
      values: [
        modelConstanta.isMembership.free,
        modelConstanta.isMembership.level1_lifetime,
        modelConstanta.isMembership.level1_monthly,
        modelConstanta.isMembership.level2_lifetime,
        modelConstanta.isMembership.level2_monthly,
      ],
      message: "invalid membership value",
    },
    default: modelConstanta.isMembership.free,
  },
  fullname: String,
  contact: String,
  limit: {
    type: Number,
    default: 3,
  },
  contact_verified: {
    type: Boolean,
    default: false,
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  membership_start: Date,
  membership_end: Date,
  otp: String,
  history: [
    {
      id_product: String,
      name_product: String,
      thumbnail: String,
      category: String,
      date: {
        type: Date,
        default: moment.tz(Date.now(), "Asia/Bangkok"),
      },
    },
  ],
});

const UserCol = mongoose.model("user", schemaUser);
export default UserCol;
