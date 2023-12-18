import mongoose from "mongoose";

// const schemaUser = mongoose.Schema({
//   email: String,
//   password: String,
//   joined_at: Date.now,
//   is_membership: {
//     type: String,
//     enum: [
//       "free",
//       "level1_monthly",
//       "level1_lifetime",
//       "level2_monthly",
//       "level22_lifetime",
//     ],
//     default: "free",
//   },
//   fullname: String,
//   contact: String,
//   limit: {
//     type: Number,
//     default: 3,
//   },
//   contact_verified: Boolean,
//   email_verified: Boolean,
//   membership_start: Date,
//   membership_end: Date,
//   otp: String,
//   history: [
//     {
//       id_product: String,
//       date: Date.now(),
//     },
//   ],
// });

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
    default: Date.now,
  },
  is_membership: {
    type: String,
    enum: [
      "free",
      "level1_monthly",
      "level1_lifetime",
      "level2_monthly",
      "level2_lifetime",
    ],
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
        default: Date.now,
      },
    },
  ],
});

const UserCol = mongoose.model("user", schemaUser);
export default UserCol;
