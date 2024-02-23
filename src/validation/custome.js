import Joi from "joi";
import isObjectID from "../utility/mongo.js";
import modelConstanta from "../model/modelConstanta.js";

class CustomeSchema {
  static get objectIDSchema() {
    return Joi.object({
      productID: Joi.string()
        .trim()
        .required()
        .custom((value, helper) => {
          const check = isObjectID(value);
          if (!check) {
            return helper.message('"productID" is not valid');
          }

          return value;
        }),

      userID: Joi.string()
        .trim()
        .required()
        .custom((value, helper) => {
          const check = isObjectID(value);
          if (!check) {
            return helper.message('"userID" is not valid');
          }

          return value;
        }),
    });
  }

  static get membershipSchema() {
    return Joi.object({
      is_membership: Joi.string()
        .trim()
        .required()
        .valid(
          modelConstanta.isMembership.free,
          modelConstanta.isMembership.level1_monthly,
          modelConstanta.isMembership.level1_lifetime,
          modelConstanta.isMembership.level2_monthly,
          modelConstanta.isMembership.level2_lifetime
        ),
    });
  }
}

class CustomeValidation extends CustomeSchema {
  static doubleParameterObjectID(body) {
    return super.objectIDSchema.validateAsync(body, {
      abortEarly: false,
    });
  }

  static membership(body) {
    return super.membershipSchema.validateAsync(body, {
      abortEarly: false,
    });
  }
}

export default CustomeValidation;
