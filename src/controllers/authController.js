import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Email from "../utility/sendEmail.js";
import AdminCol from "../model/adminCol.js";
import UserCol from "../model/userCol.js";
import AdminValidation from "../validation/loginAdmin.js";
import ResponseErr from "../responseError/responseError.js";
import UsersValidation from "../validation/user.js";
import verifyToken from "../utility/jwt.js";
import isObjectID from "../utility/mongo.js";
import nodemailer from "nodemailer";

const authController = {
  register: async (req, res, next) => {
    try {
      const val = await UsersValidation.register(req.body);

      const check = await UserCol.findOne({ email: val.email });
      if (check) {
        throw new ResponseErr(400, "Account already exists");
      }

      const hashedPassword = await bcrypt.hash(val.password, 10);

      const data = new UserCol({
        fullname: val.fullname,
        email: val.email,
        contact: val.contact,
        password: hashedPassword,
      });
      await data.save();

      res.status(200).json({ message: "Account Registered" });
    } catch (error) {
      next(error);
    }
  },

  registerAdmin: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);

      const data = new AdminCol({ username, email, password: hashedPassword });
      await data.save();

      res.status(200).json({ message: "Account Registered" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res, next) => {
    try {
      const val = await UsersValidation.login(req.body);

      const user = await UserCol.findOne({ email: val.email });
      if (!user) {
        throw new ResponseErr(400, "Check your email or password");
      }

      const passwordMatch = await bcrypt.compare(val.password, user.password);

      if (!passwordMatch) {
        throw new ResponseErr(400, "Check your email or password");
      }

      const token = jwt.sign(
        { id: user.id, isAdmin: false },
        process.env.SECRET_KEY,
        {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 86400,
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
      });

      res.status(200).json({ message: "Login successful", id: user._id });
    } catch (error) {
      next(error);
    }
  },

  adminLogin: async (req, res, next) => {
    try {
      const val = await AdminValidation.login(req.body);
      const admin = await AdminCol.findOne({ email: val.email });

      if (!admin) {
        throw new ResponseErr(404, "Admin Not Found");
      }

      const passwordMatch = await bcrypt.compare(val.password, admin.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const token = jwt.sign(
        { id: admin.id, isAdmin: true },
        process.env.SECRET_KEY,
        {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 3600,
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
      });

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      maxAge: 0,
      sameSite: "none",
    });
    res.status(200).status(200).json({ message: "Logout successful" });
  },

  adminLogout: async (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      maxAge: 0,
      sameSite: "none",
    });
    res.status(200).json({ message: "Logout successful" });
  },

  forget: async (req, res, next) => {
    try {
      const val = await UsersValidation.forgotPassword(req.body);
      const user = await UserCol.findOne({ email: val.email });

      if (!user) {
        throw new ResponseErr(404, "Your email wrong");
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: "5m", // 5 menit
      });

      const url = `${process.env.SECRET_CLIENT_HOST}/reset-password/${token}`;

      const sender = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SECRET_EMAIL_SENDER,
          pass: process.env.SECRET_EMAIL_AUTH,
        },
      });

      const info = await sender.sendMail({
        from: '"UI Stellar"', // sender address
        to: val.email, // list of receivers
        subject: "Password reset", // Subject line
        html: `
        <b>A request has been received to change the password for your UI Stellar account. 
        </b>
        <p>Click the link below to reset your password: <br> ${url}</p>
        
        `, // html body
      });

      res.status(200).json({
        statusMessage: info.response,
        messageId: info.messageId,
        message: "Email has been sent and check your email",
      });
    } catch (err) {
      next(err);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const val = await UsersValidation.resetPassword(req.body);
      const decode = await verifyToken(val.token, process.env.SECRET_KEY);

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(val.newPassword, salt);

      const isValid = isObjectID(decode.id);
      if (!isValid) {
        throw new ResponseErr(400, "Token invalid");
      }

      const result = await UserCol.updateOne(
        { _id: decode.id },
        { password: hash }
      );

      if (result.matchedCount === 0) {
        throw new ResponseErr(400, "Token invalid");
      }

      res.status(200).json({ message: "Reset password successful" });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
