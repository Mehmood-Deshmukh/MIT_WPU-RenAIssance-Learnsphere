const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const createToken = (id) => {
  return jwt.sign(id, process.env.JWTSECRET, { expiresIn: 24 * 60 * 60 });
};

const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    if (!hash) return;
    return hash;
  } catch (err) {
    console.log(err);
    return;
  }
};
const matchPassword = async (password, hashed_password) => {
  try {
    const result = await bcrypt.compare(password, hashed_password);
    return result;
  } catch (err) {
    console.log("Invalid Password");
    return false;
  }
};

const signUpUser = (req, res) => {};
