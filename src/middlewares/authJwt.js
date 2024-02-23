import jwt from "jsonwebtoken";
import UserCol from "../model/userCol.js";
import ProductCol from "../model/productCol.js";
import verifyToken from "../utility/jwt.js";
import ResponseErr from "../responseError/responseError.js";
import isObjectID from "../utility/mongo.js";

const authJwt = {
  verifyToken: async (req, res, next) => {
    try {
      let token = req.cookies?.token;

      if (!token) {
        throw new ResponseErr(401, "Unauthorized");
      }

      const decoded = await verifyToken(token, process.env.SECRET_KEY);

      if (!isObjectID(decoded.id)) {
        throw new ResponseErr(401, "Unauthorized");
      }

      if (typeof decoded.isAdmin !== "boolean") {
        throw new ResponseErr(401, "Unauthorized");
      }

      req.userId = decoded.id;
      req.isAdmin = decoded.isAdmin;
      next();
    } catch (err) {
      next(err);
    }
  },
  isAdmin: (req, res, next) => {
    try {
      if (!req.isAdmin) {
        throw new ResponseErr(403, "Require Admin Role!");
      }
      next();
    } catch (err) {
      next(err);
    }
  },

  isUser: (req, res, next) => {
    try {
      if (req.isAdmin) {
        throw new ResponseErr(403, "Require User Role!");
      }
      next();
    } catch (err) {
      next(err);
    }
  },

  isNotMembership: async (req, res, next) => {
    try {
      const user = await UserCol.findOne({ _id: req.params.id_user });
      const typeProduct = await ProductCol.findOne({ _id: req.params.id });

      if (!req.userId) {
        return res.status(401).json({
          message: "Unauthorized, please login",
        });
      }

      if (
        user.is_membership === false &&
        typeProduct.type_product === "premium"
      ) {
        return res.status(403).json({
          message: "Forbidden, user does not have access",
        });
      }

      next();
    } catch (error) {
      res.send({ message: error.message });
    }
  },
};

export default authJwt;

/*

free limit download 3 figma only 

level1 figma only unlimited download
level2 figma + sourcode unlimited download


*/
