import Joi from "joi";
import modelConstanta from "../model/modelConstanta.js";

class ProductSchema {
  static get schema() {
    return Joi.object({
      name_product: Joi.string().trim().required(),
      description: Joi.string().trim().required(),
      category: Joi.string()
        .trim()
        .valid(
          modelConstanta.categoryProduct.mobile_design_figma,
          modelConstanta.categoryProduct.templates,
          modelConstanta.categoryProduct.web_design_figma
        )
        .required(),
      type_product: Joi.string()
        .trim()
        .valid(
          modelConstanta.typeProduct.free,
          modelConstanta.typeProduct.premium
        )
        .required(),
      thumbnail_public_id: Joi.string().trim().required(),
      thumbnail: Joi.string().trim().required(),
      source_file: Joi.string().trim().required(),
    });
  }
}

class ProductValidation extends ProductSchema {
  static valid(body) {
    return super.schema.validateAsync(body, {
      abortEarly: false,
    });
  }
}

export default ProductValidation;
