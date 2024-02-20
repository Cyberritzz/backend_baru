import mongoose from "mongoose";

function isObjectID(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export default isObjectID;
