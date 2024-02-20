import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Email from "../utility/sendEmail.js";
import AdminCol from "../model/adminCol.js";
import UserCol from "../model/userCol.js";
import AdminValidation from "../validation/loginAdmin.js";
import ResponseErr from "../responseError/responseError.js";
import UsersValidation from "../validation/user.js";

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

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      });

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

  forget: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await UserCol.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "email not found" });
      }

      const token = jwt.sign(
        { id: user.id, joined_at: user.joined_at },
        process.env.SECRET_KEY,
        {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 300, // 5 menit
        }
      );

      const url = `${process.env.SECRET_CLIENT_HOST}/reset-password/${token}`;
      const sendEmail = new Email({
        from: '"Fred Foo 👻"', // sender address
        to: email, // list of receivers
        subject: "Password reset", // Subject line
        html: `
        <b>A request has been received to change the password for your UI Stellar account. 
        </b>
        <p>Click the link below to reset your password: <br> ${url}</p>
        
        `, // html body
      });
      const info = await sendEmail.send();

      res.status(200).json({
        statusMessage: info.response,
        messageId: info.messageId,
        message: "check your email",
      });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
  resetPassword: (req, res) => {
    try {
      const { newPassword, token } = req.body;

      jwt.verify(token, process.env.SECRET_KEY, async function (err, decode) {
        if (err) {
          return res.status(400).json({ err: err.message });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        await UserCol.updateOne({ _id: decode.id }, { password: hash });

        res.status(200).json({ message: "success" });
      });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
};

export default authController;
