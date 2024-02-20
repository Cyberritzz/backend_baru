import joi from "joi";
import ResponseErr from "../responseError/responseError.js";

function errorHandling(err, req, res, next) {
  if (!err) {
    next();
    return;
  }

  if (err instanceof joi.ValidationError) {
    res.status(400).json({ errors: err.message.split(".") });
    return;
  } else if (err instanceof ResponseErr) {
    res.status(err.getStatusCode).json({ errors: [err.message] });
    return;
  }

  return res.status(500).json({ errors: [err.message] });
}

export default errorHandling;
