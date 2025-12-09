const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/users", userRoutes);


// Health Check
app.get("/", (req, res) => {
  res.send("Quiz API running"); 
});

module.exports = app;
