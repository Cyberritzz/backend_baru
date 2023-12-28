import jwt from "jsonwebtoken";
import UserCol from "../model/userCol.js";
import ProductCol from "../model/productCol.js";

const authJwt = {
  verifyToken: (req, res, next) => {
    let token = req.cookies?.token;

    if (!token) {
      return res.status(403).send({
        message: "No token provided",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized",
        });
      }

      req.userId = decoded.id;
      req.isAdmin = decoded.isAdmin || false;
      next();
    });
  },
  isAdmin: (req, res, next) => {
    if (req.isAdmin) {
      return next();
    } else {
      return res.status(403).send({
        message: "Require Admin Role!",
      });
    }
  },

  isUser: (req, res, next) => {
    if (req.userId) {
      return next();
    } else {
      return res.status(403).send({
        message: "Require User Role!",
      });
    }
  },

  isNotMembership: async (req, res, next) => {
    try {
      const is_membership = await UserCol.findOne({_id: req.params.id_user});
      const typeProduct = await ProductCol.findOne({_id : req.params.id});
      // console.log(req.params.id_user);
      // console.log(is_membership);
      // console.log(`type product : ${typeProduct.type_product}`);

      if (!req.userId) {
        return res.status(401).json({
          message: "Unauthorized, please login",
        });
      }
      if (
        is_membership.is_membership === false &&
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
