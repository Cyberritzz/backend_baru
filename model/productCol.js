import mongoose from "mongoose";
import moment from "moment-timezone";

const schemaProduct = mongoose.Schema({
  name_product: {
    type: String,
    required: true,
  },
  thumbnail: String,
  source_file: String,
  description: String,
  type_product: {
    type: String,
    enum: ["premium", "free"],
    default: "free",
  },
  category: {
    type: String,
    enum: ["templates", "web_design_figma", "mobile_design_figma"],
    default: "web_design_figma",
  },
  created_at: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Bangkok"),
  },
});

const ProductCol = mongoose.model("product", schemaProduct);
export default ProductCol;
