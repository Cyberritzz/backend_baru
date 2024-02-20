import mongoose from "mongoose";

const schemaAdmin = mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const AdminCol = mongoose.model("admin", schemaAdmin, "admin");
export default AdminCol;
