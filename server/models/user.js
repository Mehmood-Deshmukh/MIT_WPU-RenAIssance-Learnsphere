const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please Provide A Valid Email Address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    required: true,
    default: "student",
  },
  rollNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  assignment: {},
});

module.exports = mongoose.model("User", userSchema);
