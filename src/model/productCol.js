import mongoose from "mongoose";
import moment from "moment-timezone";
import modelConstanta from "./modelConstanta.js";

const schemaProduct = mongoose.Schema({
  name_product: {
    type: String,
    required: true,
  },
  thumbnail: String,
  thumbnail_public_id: String,
  source_file: String,
  source_file_public_id: {
    type: String,
    default: "",
  },
  signatureThumbnail: {
    type: String,
    default: "",
  },
  signatureSourceFile: {
    type: String,
    default: "",
  },
  description: String,
  type_product: {
    type: String,
    enum: [modelConstanta.typeProduct.premium, modelConstanta.typeProduct.free],
    default: modelConstanta.typeProduct.free,
  },
  category: {
    type: String,
    enum: [
      modelConstanta.categoryProduct.templates,
      modelConstanta.categoryProduct.web_design_figma,
      modelConstanta.categoryProduct.mobile_design_figma,
    ],
    default: modelConstanta.categoryProduct.web_design_figma,
  },

  created_at: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Bangkok"),
  },
});

const ProductCol = mongoose.model("product", schemaProduct);
export default ProductCol;
