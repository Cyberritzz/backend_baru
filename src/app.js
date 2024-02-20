import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandling from "./middlewares/errorHandling.js";
import dotenv from "dotenv";
dotenv.config();

// route
import adminRoute from "./routers/adminRoute.js";
import authRoute from "./routers/authRoute.js";
import userRoute from "./routers/userRoute.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "https://admin-uistellar.vercel.app",
      "https://uistellar.com",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(adminRoute);
app.use(authRoute);
app.use(userRoute);
app.use(errorHandling);

export default app;
