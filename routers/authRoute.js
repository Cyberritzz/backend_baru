import express from "express";
import authController from "../controllers/authController.js";
const authRoute = express.Router();

authRoute.post("/login", authController.login);
authRoute.post("/register", authController.logout);
authRoute.post("/logout", authController.logout);
authRoute.post("/admin/login", authController.adminLogin);
authRoute.post("/admin/register", authController.registerAdmin);
authRoute.post("/admin/logout", authController.adminLogout);
authRoute.post("/forget-password", authController.forget);
authRoute.post("/forget-password", authController.forget);
authRoute.post("/reset-password", authController.resetPassword);

export default authRoute;
