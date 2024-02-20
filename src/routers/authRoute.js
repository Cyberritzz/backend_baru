import express from "express";
import authController from "../controllers/authController.js";
const authRoute = express.Router();

authRoute.post("/login", authController.login);
authRoute.post("/register", authController.register);
authRoute.post("/logout", authController.logout);
authRoute.post("/admin/login", authController.adminLogin);
authRoute.post("/admin/register", authController.registerAdmin);
authRoute.post("/admin/logout", authController.adminLogout);
authRoute.post("/forgot-password", authController.forget);
authRoute.post("/reset-password", authController.resetPassword);

export default authRoute;
