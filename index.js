import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

dotenv.config();

// route
import adminRoute from "./routers/adminRoute.js";
import authRoute from "./routers/authRoute.js";
import userRoute from "./routers/userRoute.js";

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("database kenek"));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cors());
//app.use(cors({ credentials: true, origin: 'https://localhost:3001' }));
// app.use(cors({ credentials: true, origin: 'https://admin-uistellar.vercel.app' }));

app.use(cors({
  origin: ['http://localhost:3001', 'https://admin-uistellar.vercel.app'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(session({
  name: process.env.COOKIE,
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3600000,
    sameSite: 'strict'
  }
}));

app.use(adminRoute);
app.use(authRoute);
app.use(userRoute);

app.listen(3000, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
