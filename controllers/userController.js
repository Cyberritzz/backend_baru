import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Email from "../utility/sendEmail.js";
import UserCol from "../model/userCol.js";
import otpGenerator from "../utility/otpGenerator.js";

const userController = {
  getProduct: async (req, res) => {
    try {
      const result = await prisma.product.findMany({
        select: {
          id: true,
          name_product: true,
          thumbnail: true,
          description: true,
          type_product: true,
          category: true,
        },
      });

      if (!result) {
        res.status(404).send({ message: "data not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;

      const product = await prisma.product.findFirst({
        where: { id: productId },
      });

      if (!product) {
        res.status(404).send({ message: "data not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  downloadFile: async (req, res) => {
    try {
      const productId = req.params.id;
      const userId = req.params.id_user;
      const historyID = idGenerator();
      await prisma.history.create({
        data: { id: historyID, id_product: productId, id_user: userId },
      });

      const limit = await prisma.user.findFirst({
        where: { id: userId },
        select: { limit: true, is_membership: true },
      });

      const product = await prisma.product.findFirst({
        where: { id: productId },
      });

      if (!product) {
        res.status(404).send({ message: "data not found" });
      }

      if (
        (limit.is_membership === "free" && product.type_product !== "free") ||
        (["level1_monthly", "level1_lifetime"].includes(limit.is_membership) &&
          product.category === "templates")
      ) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      if (limit.is_membership === "free") {
        await prisma.user.update({
          where: { id: userId },
          data: { limit: limit.limit - 1 },
        });
      }

      res.status(200).json(product.source_file);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  updateUserMail: async (req, res) => {
    try {
      const id = req.params.id;
      const data = {
        fullname: req.body.fullName,
        email: req.body.email,
        contact: req.body.contact,
      };

      const result = await prisma.user.update({
        where: { id: id },
        data: data,
      });

      if (!result) {
        res.status(404).send({ message: "Update Failed" });
      }

      res.status(200).send({ message: "Update Success", result });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const id = req.params.id;
      const { oldPassword, newPassword } = req.body;

      const user = await prisma.user.findFirst({
        where: { id: id },
      });

      const passwordMatch = await bcrypt.compare(oldPassword, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const newHashedPassword = bcrypt.hashSync(newPassword, 10);
      const updateData = await prisma.user.update({
        where: { id: id },
        data: {
          password: newHashedPassword,
        },
      });

      if (!updateData) {
        res.status(500).send({ message: "Update Failed" });
      }
      res.status(200).send({ message: "Update Success", updateData });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  getHistory: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await prisma.history.findMany({
        where: { id_user: id },
        include: {
          product: true,
          user: true,
        },
      });

      if (!result) {
        res.status(404).send({ message: "data not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  otpEmail: async (req, res) => {
    try {
      const user = await UserCol.findOne({ _id: req.userId });

      if (user.email_verified) {
        return res.status(400).json({
          message: "email has been verified",
        });
      }

      // generate otp

      const otp = otpGenerator();
      const otpExpire = jwt.sign({ otp }, process.env.SECRET_KEY, {
        expiresIn: "5m",
        algorithm: "HS256",
        allowInsecureKeySizes: true,
      });

      await UserCol.updateOne({ _id: req.userId }, { otp: otpExpire });

      const email = new Email({
        from: "UI stellar",
        to: user.email,
        subject: "OTP code",
        html: `
        <b>code otp berlaku 5 menit 
        </b>
        <p>code otp anda : ${otp}</p>
        `,
      });

      const info = await email.send();

      res.status(200).json({
        message: "check your email",
        statusMessage: info.response,
        messageId: info.messageId,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },

  emailVerify: async (req, res) => {
    try {
      const user = await UserCol.findOne({ _id: req.userId });
      if (user.email_verified) {
        return res.status(400).json({
          message: "email has been verified",
        });
      }

      jwt.verify(user.otp, process.env.SECRET_KEY, async (err, decode) => {
        if (err) {
          return res.status(400).json({
            message: "otp error",
          });
        }

        if (decode.otp != req.body.otp) {
          return res.status(400).json({
            message: "otp error",
          });
        }

        await UserCol.updateOne({ _id: req.userId }, { email_verified: true });

        res.status(200).json({
          message: "email successfully verified",
        });
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
};

export default userController;
