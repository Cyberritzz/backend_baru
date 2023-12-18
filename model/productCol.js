import mongoose from "mongoose";

const schemaProduct = mongoose.Schema({
  name_product: String,
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
  create_at: Date.now(),
});

const ProductCol = mongoose.model("product", schemaProduct);
export default ProductCol;
