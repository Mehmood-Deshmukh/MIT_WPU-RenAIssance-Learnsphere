const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const {
  loginUser,
  signUpUser,
} = require("../controllers/userController/UserAuth");
const authenticateUser = require("../middlewares/authenticateUser");
const verifySignup = require("../middlewares/verifySignup");

router.route("/login").post(loginUser);
router.route("/signup").post(signUpUser);

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.cookie("token", "none", {
    path: "/",
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
    expires: new Date(Date.now() + 1000),
  });
  res.status(200).json({ message: "Logged Out" });
});

router.route("/authenticate-user").post(async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const user = await userModel.findById(decoded.id);
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .send({ message: "error on authenticate user route: " + err.message });
  }
});

module.exports = router;
