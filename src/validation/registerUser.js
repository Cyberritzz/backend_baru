import Joi from "joi";

class UsersSchema {
  static get registerSchema() {
    return Joi.object({
      fullname: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
      contact: Joi.string().trim().required(),
      password: Joi.string().trim().required(),
    });
  }
}

class UsersValidation extends UsersSchema {
  static register(body) {
    return super.registerSchema.validateAsync(body, {
      abortEarly: false,
    });
  }
}

export default UsersValidation;
