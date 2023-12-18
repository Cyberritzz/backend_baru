import express from "express";
import dotenv from "dotenv";
dotenv.config();

// route
import adminRoute from "./routers/adminRoute.js";
import authRoute from "./routers/authRoute.js";
import userRoute from "./routers/userRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

app.use(adminRoute);
app.use(authRoute);
app.use(userRoute);

app.listen(3000, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
