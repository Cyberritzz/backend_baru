import authJwt from "../middlewares/authJwt.js";
import userController from "../controllers/userController.js";
import checkLimit from "../middlewares/checkLimit.js";
import express from "express";

const userRoute = express.Router();

userRoute.get(
  "/user/products",
  // [authJwt.verifyToken],
  userController.getProduct
);

userRoute.get(
  "/user/products/:id",
  // [authJwt.verifyToken, authJwt.isUser, authJwt.isNotMembership],
  userController.getProductById
);

userRoute.get(
  "/user/detail/:id",
  // [authJwt.verifyToken, authJwt.isUser],
  userController.getUserDetail
);
userRoute.get(
  "/user/download/:id/:id_user",
  [authJwt.verifyToken, authJwt.isUser, authJwt.isNotMembership],
  checkLimit,
  userController.downloadFile
);

userRoute.post(
  "/user/update-data/:id",
  [authJwt.verifyToken, authJwt.isUser],
  userController.updateUserMail
);

userRoute.post(
  "/user/update-password/:id",
  [authJwt.verifyToken, authJwt.isUser],
  userController.updatePassword
);

userRoute.get(
  "/user/history/:id",
  // [authJwt.verifyToken, authJwt.isUser],
  userController.getHistory
);

userRoute.get(
  "/user/otp-email",
  [authJwt.verifyToken, authJwt.isUser],
  userController.otpEmail
);

userRoute.post(
  "/user/email-verify",
  [authJwt.verifyToken, authJwt.isUser],
  userController.emailVerify
);

userRoute.put(
  "/user/update-data/:id",
  [authJwt.verifyToken, authJwt.isUser],
  userController.updateUserMail
);

userRoute.put(
  "/user/update-password/:id",
  [authJwt.verifyToken, authJwt.isUser],
  userController.updatePassword
);

export default userRoute;
