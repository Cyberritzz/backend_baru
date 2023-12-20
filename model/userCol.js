import mongoose from "mongoose";
import moment from "moment-timezone";

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
    required : true,
    enum: {
      values:[
      "free",
      "level1_monthly",
      "level1_lifetime",
      "level2_monthly",
      "level2_lifetime",
    ],
    message : "invalid membership value"
    },
    default: "free",
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
      date: {
        type: Date,
        default: moment.tz(Date.now(), "Asia/Bangkok"),
      },
    },
  ],
});

const UserCol = mongoose.model("user", schemaUser);
export default UserCol;
