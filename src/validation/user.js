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

  static get loginSchema() {
    return Joi.object({
      email: Joi.string().trim().required(),
      password: Joi.string().trim().required(),
    });
  }

  static get forgetPasswordSchema() {
    return Joi.object({
      email: Joi.string().trim().email().required(),
    });
  }

  static get resetPasswordSchema() {
    return Joi.object({
      newPassword: Joi.string().trim().required(),
      token: Joi.string().trim().required(),
    });
  }

  static get updateEmailSchema() {
    return Joi.object({
      fullname: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
      contact: Joi.string().trim().required(),
    });
  }

  static get UpdatePasswordSchema() {
    return Joi.object({
      oldPassword: Joi.string().trim().required(),
      newPassword: Joi.string().trim().required(),
    });
  }
}

class UsersValidation extends UsersSchema {
  static register(body) {
    return super.registerSchema.validateAsync(body, {
      abortEarly: false,
    });
  }

  static login(body) {
    return super.loginSchema.validateAsync(body, {
      abortEarly: false,
    });
  }

  static forgotPassword(body) {
    return super.forgetPasswordSchema.validateAsync(body, {
      abortEarly: false,
    });
  }

  static resetPassword(body) {
    return super.resetPasswordSchema.validateAsync(body, {
      abortEarly: false,
    });
  }

  static updateEmail(body) {
    return super.updateEmailSchema.validateAsync(body, {
      abortEarly: false,
    });
  }

  static updatePassword(body) {
    return super.UpdatePasswordSchema.validateAsync(body, {
      abortEarly: false,
    });
  }
}

export default UsersValidation;
