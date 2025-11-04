require("dotenv").config();
const express = require("express");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
