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

router.route("/authenticate-user").post(authenticateUser, async (req, res) => {
  try {
    const foundUser = await userModel.findById(req.user?.id);
    res.status(200).send({ message: "Authenticated", user: foundUser });
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "User not found" });
  }
});

module.exports = router;
