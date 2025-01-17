require("dotenv").config();
const express = require("express");
const app = express();
const userAuthRoutes = require("./routes/userAuth");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Listening on port 3000");
});

app.use("/auth", userAuthRoutes);

app.get("/", (req, res) => {
  res.send("Welcome");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("Connected to Database Successfully");
  } catch (err) {
    console.log(err);
    console.log("Error Connecting to database");
  }
};

connectDB();
