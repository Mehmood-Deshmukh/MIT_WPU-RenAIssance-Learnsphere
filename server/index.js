require("dotenv").config();
const express = require("express");
const app = express();
const userAuthRoutes = require("./routes/userAuth");
const attachmentRoutes = require("./routes/attachmentRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer();

const { connectDB } = require('./config/db');

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});

app.use("/api/attachments", attachmentRoutes);
app.use("/auth", userAuthRoutes);

app.get("/", (req, res) => {
  res.send("Welcome");
});


connectDB();
