import jwt from "jsonwebtoken";
import UserCol from "../model/userCol.js";

const authJwt = {
  verifyToken: (req, res, next) => {
    let token = req.session.token;

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
      const idProduct = parseInt(req.params.id);
      const is_membership = await UserCol.findOne({
        where: { id: req.userId }
      });
      const typeProduct = await UserCol.findOne({
        where: { id: idProduct }
      })
      console.log(is_membership);
      console.log(typeProduct);
      // const isMembership = await prisma.user.findUnique({
      //   where: { id: req.userId },
      //   select: { is_membership: true },
      // });

      // const typeProduct = await prisma.product.findFirst({
      //   where: { id: idProduct },
      //   select: { type_product: true },
      // });

      if (!req.userId) {
        return res.status(401).json({
          message: "Unauthorized, please login",
        });
      }
      if (
        isMembership.is_membership === false &&
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
