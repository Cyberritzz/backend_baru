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
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});
app.use(session({
  name: process.env.COOKIE, // Nama sesi cookie
  secret: process.env.SECRET_KEY,     // Kunci rahasia untuk penandatanganan sesi
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,    // Atur ke true jika hanya menggunakan HTTPS
    httpOnly: true,   // Tidak dapat diakses oleh JavaScript di sisi klien
    maxAge: 3600000,  // Waktu kadaluarsa dalam milidetik (contoh: 1 jam)
    sameSite: 'strict' // Atur ke 'strict' untuk keamanan sesi yang lebih tinggi
  }
}));


app.use(adminRoute);
app.use(authRoute);
app.use(userRoute);

app.listen(3000, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
