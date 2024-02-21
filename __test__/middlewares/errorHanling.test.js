import errorHandling from "../../src/middlewares/errorHandling";
import joi from "joi";
import ResponseErr from "../../src/responseError/responseError";
import jwt from "jsonwebtoken";

describe("Error Handling", () => {
  let res;
  let next;

  beforeEach(() => {
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should handle Joi validation error", () => {
    const err = new joi.ValidationError("Validation error");
    errorHandling(err, null, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: ["Validation error"] });
  });

  it("should handle ResponseErr error", () => {
    const err = new ResponseErr(404, "Custom error");
    errorHandling(err, null, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ errors: ["Custom error"] });
  });

  it("should handle JWT JsonWebTokenError error", () => {
    const err = new jwt.JsonWebTokenError("JWT error");
    errorHandling(err, null, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: ["JWT error"] });
  });

  it("should handle other errors", () => {
    const err = new Error("Internal server error");
    errorHandling(err, null, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["Internal server error"],
    });
  });

  it("should call next if no error", () => {
    errorHandling(null, null, res, next);
    expect(next).toHaveBeenCalled();
  });
});
