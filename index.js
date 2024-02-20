import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(3000, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
