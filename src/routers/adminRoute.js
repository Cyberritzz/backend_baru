import authJwt from "../middlewares/authJwt.js";
import adminController from "../controllers/adminController.js";
import express from "express";

const adminRoute = express.Router();

adminRoute.get("/admin/dashboard", adminController.adminDashboard);

adminRoute.get(
  "/admin/dashboard/product",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.getProduk
);

adminRoute.get(
  "/admin/dashboard/get-users",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.getUsers
);

adminRoute.post(
  "/admin/dashboard/upload-product",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.uploadProduk
);

adminRoute.put(
  "/admin/dashboard/update-product/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.updateProduk
);

adminRoute.put(
  "/admin/dashboard/update-foto/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.updateFoto
);

adminRoute.put(
  "/admin/dashboard/update-file/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.updateRar
);

adminRoute.put(
  "/admin/dashboard/edit-membership/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.putMembership
);

// delete product by id
adminRoute.delete(
  "/admin/dashboard/delete-product/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.deleteProductById
);

// delete user by id
adminRoute.delete(
  "/admin/dashboard/delete-user/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.deleteUserById
);

// delete thumbnail from cloudinary
adminRoute.delete(
  "/admin/dashboard/cloudinary/delete-thumbnail",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.deleteThumbnail
);

// delete Raw File from cloudinary
adminRoute.delete(
  "/admin/dashboard/cloudinary/delete-raw-file",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.deleteRawFile
);

export default adminRoute;
