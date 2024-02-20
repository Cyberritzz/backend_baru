import joi from "joi";

class AdminSchema {
  static get loginSchema() {
    return joi.object({
      email: joi.string().trim().email().required(),
      password: joi.string().trim().required(),
    });
  }
}

class AdminValidation extends AdminSchema {
  static login(body) {
    return super.loginSchema.validateAsync(body, {
      abortEarly: false,
    });
  }
}

export default AdminValidation;
