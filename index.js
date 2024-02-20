import app from "./src/app.js";
import mongoose from "mongoose";

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("database kenek"));

const PORT = process.env.PORT || 3000;
app.listen(3000, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
